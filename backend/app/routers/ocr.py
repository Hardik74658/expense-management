from fastapi import APIRouter, Depends, File, UploadFile

from app.dependencies.auth import require_role
from app.schemas.common import UserRole
from app.services.ocr_service import ocr_service

router = APIRouter(prefix="/ocr", tags=["ocr"])


@router.post("/extract", summary="Extract text from receipt")
async def extract_text(file: UploadFile = File(...), current_user = Depends(require_role(UserRole.employee, UserRole.manager, UserRole.admin))):
    return await ocr_service.extract_text(file)
