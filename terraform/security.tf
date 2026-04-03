resource "aws_security_group" "web_server_sg" {
  name        = "allow_http_https"
  description = "Web server security group"
  vpc_id      = aws_vpc.secure_auth_vpc.id

  tags = { Name = "web_server_sg" }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_vpc_security_group_ingress_rule" "allow_http" {
  security_group_id = aws_security_group.web_server_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 80
  ip_protocol       = "tcp"
  to_port           = 80
}

resource "aws_vpc_security_group_ingress_rule" "allow_https" {
  security_group_id = aws_security_group.web_server_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 443
  ip_protocol       = "tcp"
  to_port           = 443
}

# SSH restricted to admin CIDR only — never 0.0.0.0/0
resource "aws_vpc_security_group_ingress_rule" "allow_ssh" {
  security_group_id = aws_security_group.web_server_sg.id
  from_port         = 22
  ip_protocol       = "tcp"
  to_port           = 22
  cidr_ipv4         = var.allowed_admin_cidr
}

resource "aws_security_group" "database_sg" {
  name        = "allow_postgres_from_web"
  description = "Database security group — PostgreSQL from web tier only"
  vpc_id      = aws_vpc.secure_auth_vpc.id

  tags = { Name = "database_sg" }

  ingress {
    security_groups = [aws_security_group.web_server_sg.id]
    description     = "PostgreSQL from web tier"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
