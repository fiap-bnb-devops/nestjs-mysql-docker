terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.50.0"
    }
  }
}

provider "aws" {
  region = "us-east-2"
}

resource "aws_vpc" "jenkins-vpc" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_eip" "jenkins-eip" {
  instance = aws_instance.jenkins-instance.id
}

resource "aws_subnet" "jenkins-subnet" {
  vpc_id            = aws_vpc.jenkins-vpc.id
  cidr_block        = cidrsubnet(aws_vpc.jenkins-vpc.cidr_block, 3, 1)
  availability_zone = "us-east-2a"

  tags = {
    Name = "Subnet"
  }
}

resource "aws_internet_gateway" "jenkins-gateway" {
  vpc_id = aws_vpc.jenkins-vpc.id

  tags = {
    Name = "Internet Gateway"
  }
}

resource "aws_route_table" "jenkins-route-table" {
  vpc_id = aws_vpc.jenkins-vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.jenkins-gateway.id
  }

  tags = {
    Name = "Route table"
  }
}

resource "aws_route_table_association" "jenkins-route-table-association" {
  subnet_id      = aws_subnet.jenkins-subnet.id
  route_table_id = aws_route_table.jenkins-route-table.id
}

resource "aws_security_group" "allow_all" {
  name = "allow_all"

  vpc_id = aws_vpc.jenkins-vpc.id

  ingress {
    description = "Allowing 22 port"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allowing 80 port"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allowing 8080 port"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "allow_all"
  }
}

resource "aws_instance" "jenkins-instance" {
  ami                         = "ami-09040d770ffe2224f"
  instance_type               = "m5.large"
  subnet_id                   = aws_subnet.jenkins-subnet.id
  security_groups             = ["${aws_security_group.allow_all.id}"]
  associate_public_ip_address = true

  tags = {
    Name = "jenkins-instance"
  }
}
