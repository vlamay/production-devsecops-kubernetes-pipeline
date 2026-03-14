resource "aws_vpc" "secure_auth_vpc" {
  cidr_block           = "10.0.0.0/16"
  instance_tenancy     = "default"
  enable_dns_hostnames = true

  tags = {
    Name = "secure_auth_vpc"
  }
}

resource "aws_subnet" "private_subnet" {
  vpc_id                  = aws_vpc.secure_auth_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = false

  tags = {
    Name = "private_subnet"
  }
}
resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.secure_auth_vpc.id
  cidr_block              = "10.0.2.0/24"
  map_public_ip_on_launch = true

  tags = {
    Name = "public_subnet"
  }
}

resource "aws_internet_gateway" "secure_auth_IGW" {
  vpc_id = aws_vpc.secure_auth_vpc.id

  tags = {
    Name = "secure_auth_IGW"
  }
}