from fastapi import APIRouter, Depends
from app.dependencies.role_checker import require_role

router = APIRouter(prefix="/test", tags=["Test"])


@router.get("/admin-only")
def admin_test(current_user = Depends(require_role("admin"))):
    return {"message": "Welcome Admin"}


@router.get("/vendor-only")
def vendor_test(current_user = Depends(require_role("vendor"))):
    return {"message": "Welcome Vendor"}


@router.get("/user-only")
def user_test(current_user = Depends(require_role("user"))):
    return {"message": "Welcome User"}