"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  CreditCard,
  Shield,
  Upload,
  QrCode,
  Download,
  ExternalLink,
  X,
  Save,
  FileText,
  File,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect, useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { uploadFile } from "../../../apiCalls/fileUpload";
import { registerUser } from "../../../apiCalls/registerUser";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

type FileData = {
  file: File;
  preview: string;
};

type BaseField = {
  name: string;
  label: string;
  required?: boolean;
  validation?: (
    value: string | FileData | null,
    formData?: Record<string, any>
  ) => string | undefined;
  icon?: React.ReactNode;
};

type InputField = BaseField & {
  type: "text" | "email" | "tel" | "password" | "file";
  placeholder?: string;
  accept?: string;
};

type SelectField = BaseField & {
  type: "select";
  options: {
    value: string;
    label: string;
    badge?: string;
    description?: string;
  }[];
  placeholder?: string;
};

type Field = InputField | SelectField;

type FormDataType = Record<string, string | FileData | null>;

const steps: { title: string; description: string; fields: Field[] }[] = [
  {
    title: "Personal Information",
    description: "Tell us about yourself to get started",
    fields: [
      {
        name: "fullName",
        label: "Full Name",
        type: "text",
        required: true,
        icon: <User className="h-4 w-4 text-gray-500" />,
        placeholder: "John Doe",
        validation: (value) => (!value ? "Name is required" : undefined),
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        required: true,
        icon: <Mail className="h-4 w-4 text-gray-500" />,
        placeholder: "john@example.com",
        validation: (value) => {
          if (!value) return "Email is required";
          if (typeof value !== "string") return "Invalid email format";
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) return "Please enter a valid email";
          return undefined;
        },
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        required: true,
        icon: <Phone className="h-4 w-4 text-gray-500" />,
        placeholder: "+1 (555) 123-4567",
        validation: (value) => {
          if (!value) return "Phone number is required";
          if (typeof value !== "string") return "Invalid phone number format";
          if (!/^\+?[0-9\s\(\)-]{8,}$/.test(value))
            return "Please enter a valid phone number";
          return undefined;
        },
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        required: true,
        placeholder: "**********",
        icon: <Lock className="h-4 w-4 text-gray-500" />,
        validation: (value) => {
          if (!value) return "Password is required";
          if (typeof value !== "string") return "Invalid password format";
          if (value.length < 8) return "Password must be at least 8 characters";
          if (!/[A-Z]/.test(value))
            return "Password must contain at least one uppercase letter";
          if (!/[0-9]/.test(value))
            return "Password must contain at least one number";
          return undefined;
        },
      },
      {
        name: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        required: true,
        placeholder: "**********",
        icon: <Shield className="h-4 w-4 text-gray-500" />,
        validation: (value, formData) => {
          if (!value) return "Please confirm your password";
          if (typeof value !== "string") return "Invalid password format";
          if (!formData || typeof formData.password !== "string")
            return "Invalid password comparison";
          if (value !== formData.password) return "Passwords do not match";
          return undefined;
        },
      },
    ],
  },
  {
    title: "Choose Your Plan",
    description: "Select a subscription plan that works for you",
    fields: [
      {
        name: "plan",
        label: "Subscription Plan",
        type: "select",
        required: true,
        icon: <CreditCard className="h-4 w-4 text-gray-500" />,
        placeholder: "Select a plan",
        options: [
          {
            value: "free",
            label: "Free Plan",
            description: "Limited access to basic features",
          },
          {
            value: "half",
            label: "Premium - $49.99/month",
            badge: "Popular",
            description: "Full access with monthly billing",
          },
          {
            value: "full",
            label: "Annual - $99.99/year",
            description: "Full access with 17% savings",
          },
        ],
        validation: (value) => (!value ? "Please select a plan" : undefined),
      },
    ],
  },
  {
    title: "Citizenship Verification",
    description: "Upload your citizenship document for verification",
    fields: [
      {
        name: "citizenship",
        label: "Citizenship Document",
        type: "file",
        required: true,
        accept: "image/*,.pdf",
        icon: <Upload className="h-4 w-4 text-gray-500" />,
        validation: (value) =>
          !value ? "Please upload your citizenship document" : undefined,
      },
    ],
  },
];

const animations = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: "easeOut" },
  },
  listItem: {
    initial: { opacity: 0, x: -10 },
    animate: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        delay: custom * 0.1,
      },
    }),
    exit: { opacity: 0, x: 10 },
  },
  scale: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const SROnly = ({ children }: { children: React.ReactNode }) => (
  <span className="sr-only">{children}</span>
);

const FileIcon = ({ type }: { type: string }) => {
  if (!type) return <File className="h-8 w-8 text-blue-500" />;

  if (type.startsWith("image/")) {
    return <Image className="h-8 w-8 text-green-500" />;
  } else if (type === "application/pdf") {
    return <FileText className="h-8 w-8 text-red-500" />;
  } else {
    return <File className="h-8 w-8 text-blue-500" />;
  }
};

const FileUploadField = ({
  field,
  error,
  value,
  onFileChange,
}: {
  field: InputField;
  error?: string;
  value: FileData | null | undefined;
  onFileChange: (field: string, value: FileData | null) => void;
}) => {
  const hasPreview = value?.preview;
  const fileType = value?.file?.type || "";
  const isImage = fileType.startsWith("image/");

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-[#185cfc]", "bg-[#185cfc]/5");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-[#185cfc]", "bg-[#185cfc]/5");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-[#185cfc]", "bg-[#185cfc]/5");

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    const filePreview = URL.createObjectURL(file);
    onFileChange(field.name, { file, preview: filePreview });
  };

  return (
    <div className="space-y-2">
      {!hasPreview ? (
        <div
          className={`relative border-2 border-dashed rounded-xl p-6 transition-all 
            ${error
              ? "border-red-300 bg-red-50"
              : "border-gray-200 hover:border-[#185cfc] hover:bg-[#185cfc]/5"
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            id={field.name}
            type="file"
            accept={field.accept || "image/*,.pdf"}
            className="absolute inset-0 font-Urbanist w-full h-full opacity-0 cursor-pointer z-10"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFile(e.target.files[0]);
              }
            }}
            aria-invalid={!!error}
            aria-describedby={error ? `${field.name}-error` : undefined}
          />

          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 mb-3 bg-[#185cfc]/10 rounded-full flex items-center justify-center">
              {field.icon || <Upload className="h-5 w-5 text-[#185cfc]" />}
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1 font-Urbanist">
              {field.label}
            </p>
            <p className="text-xs text-gray-500 mb-2 font-Urbanist">
              Drag and drop or click to browse
            </p>
            <p className="text-xs text-gray-400 font-Urbanist">
              Accepted formats: JPG, PNG, PDF
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3">
            {isImage ? (
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                <img
                  src={value.preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileIcon type={fileType} />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate font-Urbanist">
                {value.file.name}
              </p>
              <p className="text-xs text-gray-500 font-Urbanist">
                {(value.file.size / 1024).toFixed(1)} KB •{" "}
                {fileType.split("/")[1]?.toUpperCase() || "FILE"}
              </p>
              <div className="mt-2">
                <button
                  type="button"
                  className="text-xs text-[#185cfc] hover:underline inline-flex items-center font-Urbanist"
                  onClick={() => window.open(value.preview, "_blank")}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                URL.revokeObjectURL(value.preview);
                onFileChange(field.name, null);
              }}
              className="text-gray-400 hover:text-red-500"
              aria-label="Remove file"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <p
          id={`${field.name}-error`}
          className="text-xs text-red-500 flex items-center mt-1 font-Urbanist"
          role="alert"
        >
          <AlertCircle className="h-3 w-3 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

const RegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormDataType>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [generalError, setGeneralError] = useState<string>("");
  const [passwordHint, setPasswordHint] = useState<string>("");
  const [passwordMatchStatus, setPasswordMatchStatus] = useState<string>("");
  const [savedEmailSent, setSavedEmailSent] = useState<boolean>(false);
  const [savedEmail, setSavedEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const router = useRouter()

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const password = formData.password as string | undefined | null;
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  }, [formData.password]);

  useEffect(() => {
    return () => {
      Object.values(formData).forEach((value) => {
        if (value && typeof value === "object" && (value as FileData).preview) {
          URL.revokeObjectURL((value as FileData).preview);
        }
      });
    };
  }, []);

  useEffect(() => {
    const announcement = document.getElementById("step-announcement");
    if (announcement) {
      announcement.textContent = `Step ${currentStep + 1} of ${steps.length}: ${steps[currentStep].title
        }`;
    }
  }, [currentStep]);

  const calculateProgress = () => {
    const totalRequiredFields = steps.reduce(
      (count, step) =>
        count + step.fields.filter((field) => field.required).length,
      0
    );

    const completedRequiredFields = Object.keys(formData).filter(
      (fieldName) => {
        const field = steps
          .flatMap((step) => step.fields)
          .find((f) => f.name === fieldName);
        return (
          field &&
          field.required &&
          formData[fieldName] &&
          (!field.validation || !field.validation(formData[fieldName], formData))
        );
      }
    ).length;

    return Math.round((completedRequiredFields / totalRequiredFields) * 100);
  };

  const allFieldsValid = useMemo(() => {
    const currentFields = steps[currentStep].fields;
    return currentFields.every(
      (field) =>
        !field.required ||
        (formData[field.name] &&
          (!field.validation || !field.validation(formData[field.name], formData))
        ));
  }, [currentStep, formData]);

  const validateStep = () => {
    const currentFields = steps[currentStep].fields;
    const newErrors: Record<string, string> = {};
    let isValid = true;

    currentFields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
        isValid = false;
      } else if (field.validation && (formData[field.name] || field.required)) {
        const error = field.validation(formData[field.name], formData);
        if (error) {
          newErrors[field.name] = error;
          isValid = false;
        }
      }
    });

    setErrors({});
    setTimeout(() => {
      setErrors(newErrors);
    }, 10);

    if (!isValid) {
      setGeneralError("Please correct the highlighted errors");
      setTimeout(() => setGeneralError(""), 5000);
    }

    return isValid;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined as unknown as string }));
    }

    if (field === "password" && value) {
      const passwordField = steps[0].fields.find((f) => f.name === "password");
      if (passwordField?.validation) {
        const error = passwordField.validation(value, formData);
        setPasswordHint(error || "");
      }

      if (formData.confirmPassword) {
        setPasswordMatchStatus(
          value === formData.confirmPassword ? "Passwords match" : "Passwords don't match"
        );
      }
    }

    if (field === "confirmPassword" && value) {
      setPasswordMatchStatus(
        value === formData.password ? "Passwords match" : "Passwords don't match"
      );
    }
  };

  const handleFileChange = (field: string, value: FileData | null) => {
    setFormData((prev) => {
      const oldValue = prev[field] as FileData | undefined;
      if (oldValue?.preview) {
        URL.revokeObjectURL(oldValue.preview);
      }
      return { ...prev, [field]: value };
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined as unknown as string }));
    }
  };

  const handleSaveProgress = () => {
    const progressData = {
      currentStep,
      formData: Object.fromEntries(
        Object.entries(formData).map(([key, value]) => {
          if (value && typeof value === "object" && (value as FileData).file) {
            return [
              key,
              {
                fileName: (value as FileData).file.name,
                fileType: (value as FileData).file.type,
              },
            ];
          }
          return [key, value];
        })
      ),
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("registrationProgress", JSON.stringify(progressData));
    setSavedEmailSent(true);
    setTimeout(() => {
      setGeneralError("Progress saved! Recovery link sent to your email.");
      setTimeout(() => setGeneralError(""), 5000);
    }, 2000);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsLoading(true);
    try {
      // Upload citizenship image first
      const citizenshipFile = formData.citizenship as FileData | undefined;
      if (!citizenshipFile) {
        throw new Error("Citizenship document is required");
      }

      const uploadResponse = await uploadFile(citizenshipFile.file);
      const citizenshipImageUrl = uploadResponse.data.url;

      // Prepare user data
      const userData = {
        fullname: formData.fullName as string,
        role: "user",
        email: formData.email as string,
        phone: formData.phone as string,
        password: formData.password as string,
        citizenshipImageUrl,
        plan: formData.plan as string,
        courseEnrolled: "67d2ab0cff801f3bc0c0dd8e" // Hardcoded for now
      };

      // Register user
      const registerResponse = await registerUser(userData);

      if (registerResponse.success) {
        setIsCompleted(true);
        // Clear saved progress
        localStorage.removeItem("registrationProgress");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setGeneralError(error instanceof Error ? error.message : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = () => {
    if (!validateStep()) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getStepStatus = (index: number): "current" | "completed" | "upcoming" => {
    if (index === currentStep) return "current";
    if (index < currentStep) return "completed";
    return "upcoming";
  };

  const getStrengthColor = () => {
    if (passwordStrength < 50) return "bg-red-500";
    if (passwordStrength < 100) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (isCompleted) {
    return (

      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl"
        >
          <div className={`${isDesktop ? "p-8 shadow-none border-0" : "p-8 shadow-lg border-0 rounded-3xl"}`}>
            <div className="flex flex-col items-center text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.2,
                }}
                className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center"
              >
                <Check className="h-10 w-10 text-green-500" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 font-Urbanist">
                Registration Complete!
              </h2>
              <p className="text-gray-600 max-w-xs font-Urbanist">
                Thank you for registering. We've sent a confirmation email with
                further instructions.
              </p>
              <Button
                onClick={() => router.push("/login")}
                className="mt-6 bg-[#185cfc] rounded-full px-8 py-6 hover:bg-[#185cfc]/90 h-auto font-Urbanist"
              >
                Login
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <div className={`${isDesktop ? "p-6" : "p-4 sm:p-6 shadow-xl border-0 rounded-3xl"}`}>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-1.5 h-12 bg-[#185cfc] rounded-full"></div>
            <div>
              <h2 className="text-2xl font-bold text-[#185cfc] font-Urbanist">
                Registration
              </h2>
              <p className="text-gray-500 text-sm font-Urbanist">
                Complete in just a few steps
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="text-gray-500 font-Urbanist">
                Overall Progress
              </span>
              <span className="text-[#185cfc] font-medium font-Urbanist">
                {calculateProgress()}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#185cfc] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${calculateProgress()}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          <div id="step-announcement" className="sr-only" aria-live="polite" aria-atomic="true"></div>

          <div className="space-y-6">
            <div className="flex justify-between mb-8 relative">
              {steps.map((step, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="z-10 flex flex-col items-center">
                        <div
                          className={`flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300 
                            ${getStepStatus(index) === "current"
                              ? "bg-[#185cfc] text-white border-[#185cfc] ring-4 ring-[#185cfc]/20"
                              : getStepStatus(index) === "completed"
                                ? "bg-green-500 text-white border-green-500"
                                : "bg-white text-gray-400 border-gray-200"
                            }`}
                          aria-current={getStepStatus(index) === "current" ? "step" : undefined}
                        >
                          {getStepStatus(index) === "completed" ? (
                            <>
                              <Check className="h-4 w-4 sm:h-6 sm:w-6" />
                              <SROnly>Completed</SROnly>
                            </>
                          ) : (
                            <>
                              <span className="text-xs sm:text-sm font-medium">
                                {index + 1}
                              </span>
                              <SROnly>{step.title}</SROnly>
                            </>
                          )}
                        </div>
                        <span
                          className={`text-[10px] sm:text-xs mt-1 font-medium font-Urbanist ${getStepStatus(index) === "current"
                              ? "text-[#185cfc]"
                              : getStepStatus(index) === "completed"
                                ? "text-green-500"
                                : "text-gray-400"
                            }`}
                        >
                          {index === 0 ? "Info" : index === 1 ? "Plan" : "Docs"}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-Urbanist">{step.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}

              <div className="absolute top-6 h-0.5 bg-gray-200 w-full -z-0" style={{ transform: "translateY(-50%)" }} />
              <div
                className="absolute top-6 h-0.5 bg-green-500 -z-0 transition-all duration-300"
                style={{
                  transform: "translateY(-50%)",
                  width: `${(currentStep / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>

            {generalError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4"
              >
                <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-sm font-Urbanist">
                    {generalError}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            <div className="p-0">
              <motion.div
                key={currentStep}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animations.fadeInUp}
              >
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-[#185cfc] mb-1 font-Urbanist">
                    {steps[currentStep].title}
                  </h3>
                  <p className="text-gray-500 text-sm font-Urbanist">
                    {steps[currentStep].description}
                  </p>
                </div>

                {currentStep === 1 ? (
                  <div className="space-y-4">
                    {(steps[1].fields[0] as SelectField).options.map((option, idx) => (
                      <motion.div
                        key={option.value}
                        onClick={() => handleInputChange("plan", option.value)}
                        className={`p-4 border-2 rounded-xl relative transition-all cursor-pointer ${formData.plan === option.value
                            ? "border-[#185cfc] bg-[#185cfc]/5"
                            : "border-gray-200 hover:border-gray-300"
                          }`}
                        variants={animations.listItem}
                        initial="initial"
                        animate="animate"
                        custom={idx}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium font-Urbanist">
                                {option.label}
                              </h4>
                              {option.badge && (
                                <Badge className="bg-blue-500">
                                  {option.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1 font-Urbanist">
                              {option.description}
                            </p>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.plan === option.value
                                ? "border-[#185cfc]"
                                : "border-gray-300"
                              }`}
                          >
                            {formData.plan === option.value && (
                              <div className="w-3 h-3 rounded-full bg-[#185cfc]" />
                            )}
                          </div>
                        </div>
                        {option.value === "half" && option.badge === "Popular" && (
                          <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full" />
                        )}
                      </motion.div>
                    ))}
                    {errors.plan && (
                      <p className="text-xs text-red-500 flex items-center mt-2 font-Urbanist" role="alert">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.plan}
                      </p>
                    )}
                  </div>
                ) : currentStep === 2 ? (
                  <div className="space-y-5">
                    {steps[currentStep].fields.map((field, idx) => (
                      <motion.div
                        key={field.name}
                        variants={animations.listItem}
                        initial="initial"
                        animate="animate"
                        custom={idx}
                      >
                        <div className="flex justify-between mb-1.5">
                          <Label htmlFor={field.name} className="text-sm font-medium text-gray-700 font-Urbanist">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </Label>
                        </div>

                        <FileUploadField
                          field={field as InputField}
                          error={errors[field.name]}
                          value={formData[field.name] as FileData | null}
                          onFileChange={handleFileChange}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-5">
                    {steps[currentStep].fields.map((field, idx) => (
                      <motion.div
                        key={field.name}
                        variants={animations.listItem}
                        initial="initial"
                        animate="animate"
                        custom={idx}
                      >
                        <div className="flex justify-between">
                          <Label htmlFor={field.name} className="mb-1.5 text-sm font-medium text-gray-700 font-Urbanist">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </Label>
                          {errors[field.name] && (
                            <span className="text-xs text-red-500 flex items-center font-Urbanist" id={`${field.name}-error`} role="alert">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {errors[field.name]}
                            </span>
                          )}
                        </div>

                        {field.type === "password" ? (
                          <div className="relative">
                            <div className="absolute left-3 -top-1 h-12 flex items-center pointer-events-none z-10">
                              {field.icon}
                            </div>
                            <Input
                              id={field.name}
                              type={
                                field.name === "password"
                                  ? showPassword
                                    ? "text"
                                    : "password"
                                  : showConfirmPassword
                                    ? "text"
                                    : "password"
                              }
                              className={`pl-10 pr-10 font-Urbanist ${errors[field.name] ? "border-red-300 bg-red-50" : ""
                                }`}
                              placeholder={field.placeholder}
                              value={(formData[field.name] as string) || ""}
                              onChange={(e) =>
                                handleInputChange(field.name, e.target.value)
                              }
                              aria-invalid={!!errors[field.name]}
                              aria-describedby={
                                errors[field.name] ? `${field.name}-error` : undefined
                              }
                            />

                            {field.name === "password" && formData.password && (
                              <div className="mt-2">
                                <div className="flex justify-between mb-1">
                                  <span className="text-xs text-gray-500 font-Urbanist">
                                    Password Strength
                                  </span>
                                  <span className="text-xs text-gray-500 font-Urbanist">
                                    {passwordStrength < 50
                                      ? "Weak"
                                      : passwordStrength < 100
                                        ? "Good"
                                        : "Strong"}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className={`h-1.5 rounded-full ${getStrengthColor()}`}
                                    style={{ width: `${passwordStrength}%` }}
                                  />
                                </div>
                                {passwordHint && (
                                  <p className="text-xs text-red-500 mt-1 font-Urbanist">
                                    {passwordHint}
                                  </p>
                                )}
                              </div>
                            )}

                            {field.name === "confirmPassword" &&
                              formData.confirmPassword && (
                                <p
                                  className={`text-xs mt-1 font-Urbanist ${passwordMatchStatus === "Passwords match"
                                      ? "text-green-500"
                                      : "text-red-500"
                                    }`}
                                >
                                  {passwordMatchStatus}
                                </p>
                              )}
                          </div>
                        ) : field.type === "select" ? (
                          <Select
                            onValueChange={(value) =>
                              handleInputChange(field.name, value)
                            }
                            value={(formData[field.name] as string) || ""}
                          >
                            <SelectTrigger
                              className={`pl-10 ${errors[field.name] ? "border-red-300 bg-red-50" : ""
                                }`}
                            >
                              <div className="absolute left-3 -top-1 h-10 flex items-center pointer-events-none z-10">
                                {field.icon}
                              </div>
                              <SelectValue
                                placeholder={field.placeholder || "Select an option"}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {(field as SelectField).options.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  <div className="flex items-center gap-2">
                                    <span>{option.label}</span>
                                    {option.badge && (
                                      <Badge variant="secondary">
                                        {option.badge}
                                      </Badge>
                                    )}
                                  </div>
                                  {option.description && (
                                    <p className="text-xs text-gray-500 mt-1 font-Urbanist">
                                      {option.description}
                                    </p>
                                  )}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="relative">
                            <div className="absolute left-3 -top-1 h-12 flex items-center pointer-events-none z-10">
                              {field.icon}
                            </div>
                            <Input
                              id={field.name}
                              type={field.type}
                              className={`pl-10 font-Urbanist ${errors[field.name] ? "border-red-300 bg-red-50" : ""
                                }`}
                              placeholder={field.placeholder}
                              value={(formData[field.name] as string) || ""}
                              onChange={(e) =>
                                handleInputChange(field.name, e.target.value)
                              }
                              aria-invalid={!!errors[field.name]}
                              aria-describedby={
                                errors[field.name] ? `${field.name}-error` : undefined
                              }
                            />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            <div className="flex justify-between pt-4">
              <div className="flex space-x-3">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    className="rounded-full w-26 px-6 py-3 h-auto font-Urbanist"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                )}

              </div>
              <Button
                type="button"
                onClick={handleNextStep}
                disabled={!allFieldsValid || isLoading}
                className={` rounded-full bg-[#185cfc]  w-26 px-6 py-3 h-auto font-Urbanist ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
              >
                {isLoading ? (
                  "Processing..."
                ) : currentStep === steps.length - 1 ? (
                  "Submit"
                ) : (
                  <>
                    Next <ArrowRight className="h-4 w-4 " />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>


    </div>
    <Footer/>
    </>
  );
};

export default RegistrationForm;