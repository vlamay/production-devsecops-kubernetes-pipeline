variable "region" {
  description = "The AWS region where resources will be created"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "The instance type to use for the EC2 server"
  type        = string
  default     = "t2.micro"
}

variable "ami_id" {
  description = "The AMI ID for the Ubuntu server"
  type        = string
  default     = "ami-0c101f26f147fa7fd"
}

variable "public_key" {
  description = "SSH public key"
  type        = string
  default     = "ssh-rsa placeholder-key"
}