'use client';

import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Loader2,
  Check,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Trash2,
  Edit,
  Key,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

// Define proper interfaces for the data models
interface Batch {
  _id: string;
  batch_name: string;
  // Add other batch properties as needed
}

interface Course {
  _id: string;
  title: string;
  // Add other course properties as needed
}

interface ExamResult {
  examName: string;
  totalQuestions: number;
  correctAnswers: number;
}

interface User {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  role: 'user' | 'teacher' | 'admin';
  status: 'verified' | 'unverified';
  plan: 'free' | 'premium' | 'full';
  createdAt: string;
  batch?: Batch;
  courseEnrolled?: Course;
  citizenshipImageUrl?: string;
  examsAttended?: ExamResult[];
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  limit: number;
}

interface UsersResponse {
  users: User[];
  count: number;
}

interface SearchUsersResponse {
  data: {
    users: User[];
    totalPages: number;
  };
}

interface BatchesResponse {
  data: Batch[];
  meta: {
    totalPages: number;
  };
}

interface UpdateUserResponse {
  user: User;
}

// API service interfaces
interface UserApiServiceType {
  getUnverifiedUsers: (page: number, limit: number) => Promise<UsersResponse>;
  getVerifiedUsers: (page: number, limit: number) => Promise<UsersResponse>;
  searchUsers: (query: string, page: number, limit: number) => Promise<SearchUsersResponse>;
  getBatches: (page: number, limit: number) => Promise<BatchesResponse>;
  verifyUser: (userId: string, batchId: string) => Promise<any>;
  deleteUser: (userId: string) => Promise<any>;
  updateUser: (userId: string, data: EditFormState) => Promise<UpdateUserResponse>;
  resetPassword: (userId: string, newPassword: string) => Promise<any>;
}

// Assuming this is imported from an external file
const UserApiService: UserApiServiceType = {
  getUnverifiedUsers: async (page, limit) => ({ users: [], count: 0 }),
  getVerifiedUsers: async (page, limit) => ({ users: [], count: 0 }),
  searchUsers: async (query, page, limit) => ({ data: { users: [], totalPages: 0 } }),
  getBatches: async (page, limit) => ({ data: [], meta: { totalPages: 0 } }),
  verifyUser: async (userId, batchId) => ({}),
  deleteUser: async (userId) => ({}),
  updateUser: async (userId, data) => ({ user: {} as User }),
  resetPassword: async (userId, newPassword) => ({}),
};

// Interface for the edit form state
interface EditFormState {
  fullname: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  plan: string;
  batch: string;
}

export default function AdminVerifyUsersPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState<'unverified' | 'verified' | 'search'>('unverified');
  
  // User data states
  const [unverifiedUsers, setUnverifiedUsers] = useState<User[]>([]);
  const [verifiedUsers, setVerifiedUsers] = useState<User[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);

  // Loading states
  const [isLoadingUnverified, setIsLoadingUnverified] = useState<boolean>(true);
  const [isLoadingVerified, setIsLoadingVerified] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Selected user and dialog states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState<boolean>(false);
  
  // Action states
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isResettingPassword, setIsResettingPassword] = useState<boolean>(false);
  
  // Batch states
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [isLoadingBatches, setIsLoadingBatches] = useState<boolean>(false);

  // Search and password states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  // Form state for editing user
  const [editForm, setEditForm] = useState<EditFormState>({
    fullname: '',
    email: '',
    phone: '',
    role: '',
    status: '',
    plan: '',
    batch: '',
  });

  // Pagination states
  const [unverifiedPagination, setUnverifiedPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });

  const [verifiedPagination, setVerifiedPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });

  const [searchPagination, setSearchPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });

  // Add batch pagination state for verification dialog
  const [batchPagination, setBatchPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });

  // States for Edit Batches
  const [isLoadingEditBatches, setIsLoadingEditBatches] = useState<boolean>(false);
  const [editBatches, setEditBatches] = useState<Batch[]>([]);
  const [editBatchPagination, setEditBatchPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });

  // Track if verified users have been loaded
  const verifiedUsersLoaded = useRef<boolean>(false);

  // Fetch unverified users with pagination
  const fetchUnverifiedUsers = async (page = 1) => {
    setIsLoadingUnverified(true);
    try {
      const response = await UserApiService.getUnverifiedUsers(page, unverifiedPagination.limit);

      setUnverifiedUsers(response.users);
      setUnverifiedPagination({
        ...unverifiedPagination,
        currentPage: page,
        totalPages: Math.ceil(response.count / unverifiedPagination.limit),
      });
    } catch (error) {
      toast.error('Failed to fetch unverified users');
      console.error('Error fetching unverified users:', error);
    } finally {
      setIsLoadingUnverified(false);
    }
  };

  // Fetch verified users with pagination
  const fetchVerifiedUsers = async (page = 1) => {
    setIsLoadingVerified(true);
    try {
      const response = await UserApiService.getVerifiedUsers(page, verifiedPagination.limit);

      setVerifiedUsers(response.users);
      setVerifiedPagination({
        ...verifiedPagination,
        currentPage: page,
        totalPages: Math.ceil(response.count / verifiedPagination.limit),
      });

      verifiedUsersLoaded.current = true;
    } catch (error) {
      toast.error('Failed to fetch verified users');
      console.error('Error fetching verified users:', error);
    } finally {
      setIsLoadingVerified(false);
    }
  };

  // Search users
  const handleSearch = async (page = 1) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await UserApiService.searchUsers(
        searchQuery,
        page,
        searchPagination.limit
      );

      setSearchedUsers(response.data.users);
      setSearchPagination({
        ...searchPagination,
        currentPage: page,
        totalPages: response.data.totalPages,
      });
    } catch (error) {
      toast.error('Failed to search users');
      console.error('Error searching users:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Fetch batches with pagination for verification dialog
  const fetchBatches = async (page = 1) => {
    setIsLoadingBatches(true);
    try {
      const response = await UserApiService.getBatches(page, batchPagination.limit);
      setBatches(response.data);
      setBatchPagination({
        ...batchPagination,
        currentPage: page,
        totalPages: response.meta.totalPages || 1,
      });
      
      // Only set default selected batch if this is the first page and there are batches
      if (page === 1 && response.data.length > 0 && !selectedBatchId) {
        setSelectedBatchId(response.data[0]._id);
      }
    } catch (error) {
      toast.error('Failed to fetch batches');
      console.error('Error fetching batches:', error);
    } finally {
      setIsLoadingBatches(false);
    }
  };

  // Handle batch pagination for verification dialog
  const handleBatchPageChange = (page: number) => {
    fetchBatches(page);
  };

  // Fetch batches with pagination for edit dialog
  const fetchEditBatches = async (page = 1) => {
    setIsLoadingEditBatches(true);
    try {
      const response = await UserApiService.getBatches(page, editBatchPagination.limit);
      setEditBatches(response.data);
      setEditBatchPagination({
        ...editBatchPagination,
        currentPage: page,
        totalPages: response.meta.totalPages || 1,
      });
    } catch (error) {
      toast.error('Failed to fetch batches');
      console.error('Error fetching batches:', error);
    } finally {
      setIsLoadingEditBatches(false);
    }
  };

  // Handle batch pagination for edit dialog
  const handleEditBatchPageChange = (page: number) => {
    fetchEditBatches(page);
  };

  // Initial load of unverified users
  useEffect(() => {
    fetchUnverifiedUsers();
  }, []);

  // Handle tab change
  useEffect(() => {
    if (activeTab === 'verified' && !verifiedUsersLoaded.current) {
      fetchVerifiedUsers();
    }
  }, [activeTab]);

  // Fetch batches when verification dialog opens
  useEffect(() => {
    if (isConfirmDialogOpen) {
      fetchBatches(1); // Start with page 1 when dialog opens
      setSelectedBatchId(''); // Reset selected batch
    }
  }, [isConfirmDialogOpen]);

  // Fetch batches when edit dialog opens
  useEffect(() => {
    if (isEditDialogOpen) {
      fetchEditBatches(1);
    }
  }, [isEditDialogOpen]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'unverified' | 'verified' | 'search');
  };

  const handleVerifyClick = (user: User) => {
    setSelectedUser(user);
    setIsConfirmDialogOpen(true);
  };

  const handleViewDetailsClick = (user: User) => {
    setSelectedUser(user);
    setIsDetailsDialogOpen(true);
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      fullname: user.fullname || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || '',
      status: user.status || '',
      plan: user.plan || '',
      batch: user.batch?._id || '',
    });
    setIsEditDialogOpen(true);
  };

  const confirmVerification = async () => {
    if (!selectedUser || !selectedBatchId) {
      toast.error('Please select a batch');
      return;
    }

    setIsVerifying(true);
    try {
      await UserApiService.verifyUser(selectedUser._id, selectedBatchId);
      toast.success(`${selectedUser.fullname} has been verified successfully`);

      setUnverifiedUsers(prevUsers => prevUsers.filter(user => user._id !== selectedUser._id));
      verifiedUsersLoaded.current = false;
      setIsConfirmDialogOpen(false);
    } catch (error) {
      toast.error('Failed to verify user');
      console.error('Error verifying user:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setIsDeleting(true);
    try {
      await UserApiService.deleteUser(selectedUser._id);
      toast.success(`${selectedUser.fullname} has been deleted successfully`);

      if (activeTab === 'unverified') {
        setUnverifiedUsers(prevUsers => prevUsers.filter(user => user._id !== selectedUser._id));
      } else if (activeTab === 'verified') {
        setVerifiedUsers(prevUsers => prevUsers.filter(user => user._id !== selectedUser._id));
      } else {
        setSearchedUsers(prevUsers => prevUsers.filter(user => user._id !== selectedUser._id));
      }

      setIsDetailsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to delete user');
      console.error('Error deleting user:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    setIsUpdating(true);
    try {
      const response = await UserApiService.updateUser(selectedUser._id, editForm);
      toast.success(`${response.user.fullname} has been updated successfully`);

      // Update the user in the appropriate list
      const updateUserInList = (users: User[]) =>
        users.map(user => user._id === selectedUser._id ? response.user : user);

      if (activeTab === 'unverified') {
        setUnverifiedUsers(updateUserInList(unverifiedUsers));
      } else if (activeTab === 'verified') {
        setVerifiedUsers(updateUserInList(verifiedUsers));
      } else {
        setSearchedUsers(updateUserInList(searchedUsers));
      }

      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update user');
      console.error('Error updating user:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser || !newPassword) {
      toast.error('Please enter a new password');
      return;
    }

    setIsResettingPassword(true);
    try {
      await UserApiService.resetPassword(selectedUser._id, newPassword);
      toast.success(`Password for ${selectedUser.fullname} has been reset successfully`);
      setIsResetPasswordDialogOpen(false);
      setNewPassword('');
    } catch (error) {
      toast.error('Failed to reset password');
      console.error('Error resetting password:', error);
    } finally {
      setIsResettingPassword(false);
    }
  };

  // Pagination controls
  const handlePageChange = (tab: string, page: number) => {
    if (tab === 'unverified') {
      fetchUnverifiedUsers(page);
    } else if (tab === 'verified') {
      fetchVerifiedUsers(page);
    } else {
      handleSearch(page);
    }
  };

  // Pagination component
  const PaginationControls = ({ tab, pagination }: { tab: string, pagination: PaginationState }) => {
    const { currentPage, totalPages } = pagination;

    return (
      <div className="flex items-center justify-between px-2 py-4">
        <div>
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(tab, 1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(tab, currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(tab, currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(tab, totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 h-screen px-10">
      <h1 className="text-3xl font-bold mb-6">User Verification Dashboard</h1>

      <div className="flex justify-between items-center mb-6">
        <Tabs
          defaultValue="unverified"
          value={activeTab}
          onValueChange={handleTabChange}
        >
          <TabsList>
            <TabsTrigger value="unverified">
              Unverified Users
              {unverifiedUsers.length > 0 && (
                <Badge className="ml-2" variant="destructive">
                  {unverifiedUsers.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="verified">
              Verified Users
              {verifiedUsers.length > 0 && (
                <Badge className="ml-2" variant="default">
                  {verifiedUsers.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search users by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button onClick={() => {
            setActiveTab('search');
            handleSearch();
          }} disabled={!searchQuery.trim()}>
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {activeTab === 'search' ? (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>
              Users matching your search query
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSearching ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Searching users...</span>
              </div>
            ) : searchedUsers.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                {searchQuery ? 'No users found matching your search' : 'Enter a search query to find users'}
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchedUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">{user.fullname}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'verified' ? 'default' : 'destructive'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {user.plan}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="mr-2"
                            onClick={() => handleViewDetailsClick(user)}
                          >
                            <Eye className="h-4 w-4 mr-1" /> Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mr-2"
                            onClick={() => handleEditClick(user)}
                          >
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          {user.status !== 'verified' && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleVerifyClick(user)}
                            >
                              <Check className="h-4 w-4 mr-1" /> Verify
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <PaginationControls
                  tab="search"
                  pagination={searchPagination}
                />
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsContent value="unverified">
            <Card>
              <CardHeader>
                <CardTitle>Unverified Users</CardTitle>
                <CardDescription>
                  Review and verify new user registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingUnverified ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading users...</span>
                  </div>
                ) : unverifiedUsers.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    No unverified users found
                  </div>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Registration Date</TableHead>
                          <TableHead>Plan</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {unverifiedUsers.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell className="font-medium">{user.fullname}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phone}</TableCell>
                            <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {user.plan}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="mr-2"
                                onClick={() => handleViewDetailsClick(user)}
                              >
                                <Eye className="h-4 w-4 mr-1" /> Details
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleVerifyClick(user)}
                              >
                                <Check className="h-4 w-4 mr-1" /> Verify
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <PaginationControls
                      tab="unverified"
                      pagination={unverifiedPagination}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verified">
            <Card>
              <CardHeader>
                <CardTitle>Verified Users</CardTitle>
                <CardDescription>
                  List of all verified users in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingVerified ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading users...</span>
                  </div>
                ) : verifiedUsers.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    No verified users found
                  </div>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Exams Taken</TableHead>
                          <TableHead>Plan</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {verifiedUsers.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell className="font-medium">{user.fullname}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phone}</TableCell>
                            <TableCell>{user.examsAttended?.length || 0}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {user.plan}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="mr-2"
                                onClick={() => handleViewDetailsClick(user)}
                              >
                                <Eye className="h-4 w-4 mr-1" /> Details
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditClick(user)}
                              >
                                <Edit className="h-4 w-4 mr-1" /> Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <PaginationControls
                      tab="verified"
                      pagination={verifiedPagination}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Verification Confirmation Dialog with Improved Batch Pagination */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Confirm User Verification</DialogTitle>
            <DialogDescription className="pt-2">
              Verify {selectedUser?.fullname} and assign them to a batch
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg border">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                <span className="text-gray-500 font-medium">Name:</span>
                  <p className="font-semibold">{selectedUser?.fullname}</p>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Email:</span>
                  <p className="truncate">{selectedUser?.email}</p>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Phone:</span>
                  <p>{selectedUser?.phone}</p>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Plan:</span>
                  <p className="capitalize">{selectedUser?.plan}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Select Batch</label>
              {isLoadingBatches ? (
                <div className="flex items-center justify-center p-4 bg-gray-50 rounded-md border border-gray-200">
                  <Loader2 className="h-5 w-5 mr-2 animate-spin text-primary" />
                  <span className="text-gray-600">Loading batches...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <select
                    value={selectedBatchId}
                    onChange={(e) => setSelectedBatchId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a Batch</option>
                    {batches.map((batch) => (
                      <option key={batch._id} value={batch._id}>
                        {batch.batch_name}
                      </option>
                    ))}
                  </select>
                  
                  {/* Improved Pagination UI for Batches */}
                  <div className="flex justify-between items-center text-xs bg-gray-50 rounded-md p-2">
                    <span className="text-gray-600 font-medium">
                      Page {batchPagination.currentPage} of {batchPagination.totalPages}
                    </span>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleBatchPageChange(1)}
                        disabled={batchPagination.currentPage === 1}
                        aria-label="First page"
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleBatchPageChange(batchPagination.currentPage - 1)}
                        disabled={batchPagination.currentPage === 1}
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleBatchPageChange(batchPagination.currentPage + 1)}
                        disabled={batchPagination.currentPage === batchPagination.totalPages}
                        aria-label="Next page"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleBatchPageChange(batchPagination.totalPages)}
                        disabled={batchPagination.currentPage === batchPagination.totalPages}
                        aria-label="Last page"
                      >
                        <ChevronsRight className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
              disabled={isVerifying}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmVerification}
              disabled={isVerifying || !selectedBatchId}
              className="ml-2"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Verify User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className='font-Urbanist'>User Details</DialogTitle>
            <DialogDescription className='font-Urbanist'>
              Complete information for {selectedUser?.fullname}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 font-Urbanist">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <div className="space-y-2 mt-2">
                    <p><strong>Full Name:</strong> {selectedUser.fullname}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Phone:</strong> {selectedUser.phone}</p>
                    <p><strong>Role:</strong> <Badge>{selectedUser.role}</Badge></p>
                    <p><strong>Course:</strong> {selectedUser.courseEnrolled?.title}</p>
                    <p><strong>Batch:</strong> {selectedUser.batch?.batch_name || 'Not assigned'}</p>
                    <p><strong>Status:</strong> <Badge variant={selectedUser.status === 'verified' ? 'default' : 'destructive'}>{selectedUser.status}</Badge></p>
                    <p><strong>Plan:</strong> <Badge variant="outline" className="capitalize">{selectedUser.plan}</Badge></p>
                    <p><strong>Registered:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Identification Document</h3>
                  <div className="mt-2 border rounded overflow-hidden">
                    {selectedUser.citizenshipImageUrl ? (
                      <div className="aspect-video relative">
                        <Image
                          src={selectedUser.citizenshipImageUrl}
                          alt="Citizenship Document"
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No identification document available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedUser.examsAttended && selectedUser.examsAttended.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium">Exam History</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Exam Name</TableHead>
                        <TableHead className="text-right">Questions</TableHead>
                        <TableHead className="text-right">Correct Answers</TableHead>
                        <TableHead className="text-right">Score (%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedUser.examsAttended.map((exam, index) => (
                        <TableRow key={index}>
                          <TableCell>{exam.examName}</TableCell>
                          <TableCell className="text-right">{exam.totalQuestions}</TableCell>
                          <TableCell className="text-right">{exam.correctAnswers}</TableCell>
                          <TableCell className="text-right">
                            {exam.totalQuestions > 0
                              ? ((exam.correctAnswers / exam.totalQuestions) * 100).toFixed(1)
                              : 0}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <div>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteUser}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete User
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDetailsDialogOpen(false);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit User
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDetailsDialogOpen(false);
                      setIsResetPasswordDialogOpen(true);
                    }}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Reset Password
                  </Button>

                  {selectedUser.status !== 'verified' && (
                    <Button onClick={() => {
                      setIsDetailsDialogOpen(false);
                      setIsConfirmDialogOpen(true);
                    }}>
                      <Check className="h-4 w-4 mr-2" />
                      Verify User
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog with Improved Batch Pagination */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className='font-Urbanist text-xl'>Edit User</DialogTitle>
            <DialogDescription className='pt-1'>
              Update information for {selectedUser?.fullname}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 font-Urbanist">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <Input
                value={editForm.fullname || ''}
                onChange={(e) => setEditForm({ ...editForm, fullname: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <Input
                value={editForm.email || ''}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <Input
                value={editForm.phone || ''}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                value={editForm.role || ''}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="user">User</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={editForm.status || ''}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="unverified">Unverified</option>
                <option value="verified">Verified</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Plan</label>
              <select
                value={editForm.plan || ''}
                onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="free">Free</option>
                <option value="premium">Premium</option>
                <option value="full">Full</option>
              </select>
            </div>
            
            {/* Add Course Enrolled display (read-only) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Course Enrolled</label>
              <Input
                value={selectedUser?.courseEnrolled?.title || 'None'}
                readOnly
                className="bg-gray-50"
              />
            </div>

            {/* Add Batch selection with improved pagination */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Batch</label>
              {isLoadingEditBatches ? (
                <div className="flex items-center justify-center p-4 bg-gray-50 rounded-md border border-gray-200">
                  <Loader2 className="h-5 w-5 mr-2 animate-spin text-primary" />
                  <span className="text-gray-600">Loading batches...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <select
                    value={editForm.batch || ''}
                    onChange={(e) => setEditForm({ ...editForm, batch: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a Batch</option>
                    {editBatches.map((batch) => (
                      <option key={batch._id} value={batch._id}>
                        {batch.batch_name}
                      </option>
                    ))}
                  </select>
                  
                  {/* Improved Pagination UI for Edit Batches */}
                  <div className="flex justify-between items-center text-xs bg-gray-50 rounded-md p-2">
                    <span className="text-gray-600 font-medium">
                      Page {editBatchPagination.currentPage} of {editBatchPagination.totalPages}
                    </span>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleEditBatchPageChange(1)}
                        disabled={editBatchPagination.currentPage === 1}
                        aria-label="First page"
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleEditBatchPageChange(editBatchPagination.currentPage - 1)}
                        disabled={editBatchPagination.currentPage === 1}
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleEditBatchPageChange(editBatchPagination.currentPage + 1)}
                        disabled={editBatchPagination.currentPage === editBatchPagination.totalPages}
                        aria-label="Next page"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleEditBatchPageChange(editBatchPagination.totalPages)}
                        disabled={editBatchPagination.currentPage === editBatchPagination.totalPages}
                        aria-label="Last page"
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className='font-Urbanist'
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateUser} className='font-Urbanist' disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Update User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Reset Password</DialogTitle>
            <DialogDescription className="pt-2">
              Set a new password for {selectedUser?.fullname}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResetPasswordDialogOpen(false)}
              disabled={isResettingPassword}
            >
              Cancel
            </Button>
            <Button onClick={handleResetPassword} disabled={isResettingPassword || !newPassword}>
              {isResettingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <Key className="h-4 w-4 mr-2" />
                  Reset Password
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}