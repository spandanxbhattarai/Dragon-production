import React from "react";
import { format, parseISO } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  Tag,
  Info,
  FileText,
  File as FileIcon
} from "lucide-react";
import type { Event } from "../../../apiCalls/fetchEvents";

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ResourceMaterial {
  materialName: string;
  fileType: string;
  fileSize: number;
  url: string;
}

interface ExtraInformation {
  title?: string;
  description?: string;
}

const EventDetailModal = ({ event, isOpen, onOpenChange }: EventDetailModalProps) => {
  if (!event) return null;

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'h:mm a');
    } catch (e) {
      return 'Invalid time';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Add safety checks for nested objects
  const venueInfo = event.venue || { name: 'Unknown venue', address: 'No address provided' };
  const organizerInfo = event.organizer || { name: 'Unknown organizer', email: 'No email provided' };

  // Safely access venue and organizer properties
  const venueName = typeof venueInfo === 'object' ? venueInfo.name || 'Unknown venue' : 'Invalid venue data';
  const venueAddress = typeof venueInfo === 'object' ? venueInfo.address || 'No address provided' : '';

  const organizerName = typeof organizerInfo === 'object' ? organizerInfo.name || 'Unknown organizer' : 'Invalid organizer data';
  const organizerEmail = typeof organizerInfo === 'object' ? organizerInfo.email || 'No email provided' : '';
  const organizerPhone = typeof organizerInfo === 'object' && organizerInfo.phone ? organizerInfo.phone : '';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-lg border border-blue-100 shadow-lg p-0 overflow-hidden font-Urbanist">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6">
          <div className="mb-6">
            <div className="bg-white inline-flex px-3 py-1 rounded-full text-xs font-medium text-blue-600 mb-3 border border-blue-100">
              <Tag className="w-3 h-3 mr-1.5" />
              {event.event_type || 'Event'}
            </div>
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-2xl font-semibold text-blue-900 leading-tight">
                {event.title || 'Event Details'}
              </DialogTitle>
              <p className="text-sm text-blue-700 font-normal">
                {event.description || 'No description available'}
              </p>
            </DialogHeader>
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-blue-100">
              <Calendar className="h-4 w-4 text-blue-500 mr-2" />
              <div className="text-sm text-blue-800">
                <div className="font-medium">{formatDate(event.start_date)}</div>
                {format(parseISO(event.start_date), 'yyyy-MM-dd') !== format(parseISO(event.end_date), 'yyyy-MM-dd') && (
                  <div className="text-xs text-blue-600">
                    to {formatDate(event.end_date)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-blue-100">
              <Clock className="h-4 w-4 text-blue-500 mr-2" />
              <div className="text-sm text-blue-800">
                <div className="font-medium">{formatTime(event.start_date)}</div>
                <div className="text-xs text-blue-600">
                  to {formatTime(event.end_date)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Venue Information */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-blue-800 flex items-center">
                <MapPin className="h-4 w-4 mr-1.5 text-blue-500" />
                Venue
              </h3>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="text-sm font-medium text-blue-800">
                  {venueName}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  {venueAddress}
                </div>
              </div>
            </div>

            {/* Organizer Information */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-blue-800 flex items-center">
                <User className="h-4 w-4 mr-1.5 text-blue-500" />
                Organizer
              </h3>
              <div className="bg-blue-50 rounded-lg p-4 space-y-2 border border-blue-100">
                <div className="text-sm font-medium text-blue-800">
                  {organizerName}
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <Mail className="h-3 w-3 mr-1.5 text-blue-500" />
                  {organizerEmail}
                </div>
                {organizerPhone && (
                  <div className="flex items-center text-xs text-blue-600">
                    <Phone className="h-3 w-3 mr-1.5 text-blue-500" />
                    {organizerPhone}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Extra Information */}
          {event.extraInformation && Array.isArray(event.extraInformation) && event.extraInformation.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-blue-800 flex items-center mb-3">
                <Info className="h-4 w-4 mr-1.5 text-blue-500" />
                Additional Information
              </h3>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <ul className="space-y-2 text-sm text-blue-700">
                  {(event.extraInformation as ExtraInformation[]).map((info, index) => (
                    <li key={index} className="flex flex-col items-start">
                      {info.title && (
                        <span className="font-medium text-blue-800">{info.title}</span>
                      )}
                      {info.description && (
                        <span className="text-blue-600">{info.description}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Resource Materials */}
          {event.resourceMaterials && Array.isArray(event.resourceMaterials) && event.resourceMaterials.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-blue-800 flex items-center mb-3">
                <FileIcon className="h-4 w-4 mr-1.5 text-blue-500" />
                Resource Materials
              </h3>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <ul className="space-y-3">
                  {event.resourceMaterials.map((resource, index) => (
                    <li key={index} className="flex items-start">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <FileText className="h-4 w-4 mr-2 text-blue-500" />
                        <div>
                          <div className="font-medium">{resource.materialName}</div>
                          <div className="text-xs text-blue-500">
                            {resource.fileType.toUpperCase()} • {formatFileSize(resource.fileSize)}
                          </div>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <Separator className="my-6 bg-blue-100" />

          <DialogFooter>
            <div className="text-xs text-blue-500 mt-3">
              Last updated: {event.updatedAt ? formatDate(event.updatedAt) : 'Unknown'}
            </div>
            <DialogClose asChild>
              <Button 
                variant="outline" 
                className="ml-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailModal;