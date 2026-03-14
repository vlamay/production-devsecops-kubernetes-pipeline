output "instance_ip" {
  description = "This public IP address"
  value       = aws_instance.secure_auth_ec2.public_ip

}
output "public-DNS" {
  description = "This public DNS"
  value       = aws_instance.secure_auth_ec2.public_dns
}
output "instance_id" {
  description = "This Instance ID of secure-Auth-ec2"
  value       = aws_instance.secure_auth_ec2.id

}
