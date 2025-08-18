import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { serviceCategories } from '@/data/mockData';

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: any;
  mode: 'add' | 'edit';
}

const ServiceFormModal: React.FC<ServiceFormModalProps> = ({
  isOpen,
  onClose,
  service,
  mode,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: service?.name || '',
    category: service?.category || '',
    description: service?.description || '',
    price: service?.price || '',
    duration: service?.duration || '',
    available: service?.available ?? true,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.category || !formData.description || !formData.price || !formData.duration) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Show success alert with form details
    const action = mode === 'add' ? 'added' : 'updated';
    alert(`Service ${action} successfully!\n\nDetails:\nName: ${formData.name}\nCategory: ${formData.category}\nDescription: ${formData.description}\nPrice: ₹${formData.price}\nDuration: ${formData.duration} minutes\nAvailable: ${formData.available ? 'Yes' : 'No'}`);
    
    toast({
      title: `Service ${action === 'added' ? 'Added' : 'Updated'}!`,
      description: `${formData.name} has been ${action} successfully.`,
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add New Service' : 'Edit Service'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Service Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter service name"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange('category', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {serviceCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your service"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (min) *</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="60"
                min="1"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="available"
              checked={formData.available}
              onCheckedChange={(checked) => handleInputChange('available', checked)}
            />
            <Label htmlFor="available">Service Available</Label>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="hero" className="flex-1">
              {mode === 'add' ? 'Add Service' : 'Update Service'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceFormModal;