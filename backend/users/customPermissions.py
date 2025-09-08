from rest_framework.permissions import BasePermission

class IsAdminOrStaff(BasePermission):
     message = 'You are not allowed to perform this operation, as you are not an admin or a staff'
     
     def has_permission(self, request, view):
        return bool(
            request.user 
            and request.user.is_authenticated 
            and request.user.user_type in ["admin", "staff"]
        )