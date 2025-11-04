from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Mentor


class UserRegistrationTest(TestCase):
    """Test user registration endpoint"""

    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/auth/register/'

    def test_user_can_register(self):
        """Test that a user can successfully register with valid data"""
        user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'password': 'securepass123',
            'password2': 'securepass123'
        }
        response = self.client.post(self.register_url, user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='testuser').exists())

    def test_registration_fails_password_mismatch(self):
        """Test that registration fails when passwords don't match"""
        user_data = {
            'username': 'testuser2',
            'email': 'test2@example.com',
            'password': 'pass123',
            'password2': 'differentpass'
        }
        response = self.client.post(self.register_url, user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class MentorModelTest(TestCase):
    """Test Mentor model"""

    def test_create_mentor(self):
        """Test creating a mentor"""
        user = User.objects.create_user(
            username='mentor1',
            email='mentor@test.com',
            password='testpass123'
        )
        mentor = Mentor.objects.create(
            user=user,
            specialization='Software Engineering',
            bio='Experienced developer'
        )
        self.assertEqual(str(mentor), 'mentor1 - Software Engineering')
        self.assertTrue(mentor.available)
