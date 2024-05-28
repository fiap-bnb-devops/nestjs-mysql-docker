terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.50.0"
    }
  }
}

// Plugin que permite a comunicação entre o Terra Form e uma API externa
provider "aws" {
  region = "us-east-2"
}

// Resource = Recurso. Componente da nossa infraestrutura
// VPC - Virtual Private Cloud - Rede virtual para conexões internas
resource "aws_vpc" "jenkins-vpc" {
  // CIDR - Organiza os endereços IP dentro de uma subnet e VPC
  cidr_block = "10.0.0.0/16"
}

// Subnet - Intervalo de endereços IP dentro da VPC
resource "aws_subnet" "jenkins-subnet" {
  vpc_id            = aws_vpc.jenkins-vpc.id
  cidr_block        = cidrsubnet(aws_vpc.jenkins-vpc.cidr_block, 3, 1)
  availability_zone = "us-east-2a"

  tags = {
    Name = "Subnet"
  }
}

// Internet Gateway - Recurso que permite tráfego de IPv4 e IPv6
// IPv4 - 15.05.82.4
resource "aws_internet_gateway" "jenkins-gateway" {
  vpc_id = aws_vpc.jenkins-vpc.id

  tags = {
    Name = "Internet Gateway"
  }
}

// EIP - Elastic IP - Endereço de IP estático que permite acessos à nossa instância
resource "aws_eip" "jenkins-eip" {
  instance = aws_instance.jenkins.id
}

// Route Table - Conjunto de rotas que determinam como os acessos externos serão tratados pela nossa rede virtual interna (VPC)
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

// Permite a conexão entre uma subnet e uma route table
resource "aws_route_table_association" "jenkins-route-table-association" {
  subnet_id      = aws_subnet.jenkins-subnet.id
  route_table_id = aws_route_table.jenkins-route-table.id
}

// Grupo de segurança - Controle do tráfego ao nosso servidor, informando quais portas serão públicas e regras de acesso a elas
resource "aws_security_group" "allow_all" {
  name = "allow_all"

  vpc_id = aws_vpc.jenkins-vpc.id

  ingress {
    // 22 - SSH - Conectar ao servidor remotamente
    description = "Allowing 22 port"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    // 80 - HTTP - Acessar o servidor pelo navegador
    description = "Allowing 80 port"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    // 8080 - Jenkins - Acessar o Jenkins pelo navegador
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

// Servidor virtual no EC2
resource "aws_instance" "jenkins" {
  // Amazon Machine Image - Imagem que será rodada dentro de um servidor virtual da Amazon
  ami                         = "ami-09040d770ffe2224f"
  instance_type               = "m5.large"
  key_name                    = "jenkins-server"
  subnet_id                   = aws_subnet.jenkins-subnet.id
  security_groups             = ["${aws_security_group.allow_all.id}"]
  associate_public_ip_address = true

  tags = {
    Name = "jenkins-instance"
  }
}

data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"]
}
