variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  type    = string
  default = "t3.micro"
}

variable "allowed_admin_cidr" {
  description = "CIDR for SSH access — use VPN CIDR, never 0.0.0.0/0"
  type        = string
  validation {
    condition     = can(cidrnetmask(var.allowed_admin_cidr)) && var.allowed_admin_cidr != "0.0.0.0/0"
    error_message = "Must be a valid CIDR and must NOT be 0.0.0.0/0."
  }
}

variable "public_key" {
  description = "SSH public key for EC2 access"
  type        = string
  sensitive   = true
  validation {
    condition     = can(regex("^(ssh-rsa|ecdsa-sha2|ssh-ed25519) ", var.public_key))
    error_message = "Must be a valid SSH public key."
  }
}
