from __future__ import annotations

from io import BytesIO

from fastapi import HTTPException, UploadFile, status

try:
    import pytesseract
    from PIL import Image
except Exception as exc:  # pragma: no cover - optional dependency
    pytesseract = None  # type: ignore
    Image = None  # type: ignore
    _import_error = exc
else:
    _import_error = None


class OCRService:
    def __init__(self) -> None:
        self.available = pytesseract is not None and Image is not None

    async def extract_text(self, file: UploadFile) -> dict[str, str]:
        if not self.available:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"OCR service not available: {_import_error}",
            )
        content = await file.read()
        try:
            with Image.open(BytesIO(content)) as image:  # type: ignore[arg-type]
                text = pytesseract.image_to_string(image)  # type: ignore[arg-type]
        except Exception as exc:  # pragma: no cover - invalid image
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid image: {exc}")
        return {"text": text.strip()}


ocr_service = OCRService()
