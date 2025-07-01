from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
import uuid

from core.database import get_db
from core.auth import get_current_active_user
from models.user import User
from models.payment import PaymentTransaction, Refund
from models.order import Order
from schemas.payment import PaymentProcessRequest, PaymentTransaction as PaymentTransactionSchema, RefundRequest
from schemas.common import MessageResponse

router = APIRouter()

@router.post("/process", response_model=PaymentTransactionSchema)
async def process_payment(
    request: PaymentTransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Process payment"""
    # Verify order exists and belongs to user
    order = db.query(Order).filter(
        Order.id == request.order_id,
        Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    # Create payment transaction record
    payment_transaction = PaymentTransaction(
        order_id=request.order_id,
        transaction_id=request.transaction_id or f"txn_{uuid.uuid4().hex[:10]}",
        payment_method=request.payment_method,
        payment_processor=request.payment_processor,
        status=request.status,
        amount=request.amount,
        fee_amount=request.fee_amount,
        currency=request.currency,
        card_last_four=request.card_last_four,
        card_brand=request.card_brand,
        processor_response=request.processor_response,
        failure_reason=request.failure_reason,
        reference_number=request.reference_number
    )

    db.add(payment_transaction)
    db.commit()

    # TODO: Integrate with actual payment processor (Stripe, PayPal, etc.)
    # For now, simulate successful payment
    try:
        # Simulate payment processing
        payment_transaction.status = "success"
        payment_transaction.processed_at = datetime.utcnow()
        payment_transaction.reference_number = f"ref_{uuid.uuid4().hex[:8]}"

        # Update order payment status
        order.payment_status = "paid"

        db.commit()
        db.refresh(payment_transaction)

    except Exception as e:
        payment_transaction.status = "failed"
        payment_transaction.failure_reason = str(e)
        db.commit()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment processing failed"
        )

    return payment_transaction

@router.post("/{transactionId}/refund", response_model=MessageResponse)
async def refund_payment(
    transactionId: str,
    request: RefundRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Refund payment"""
    # Find payment transaction
    payment_transaction = db.query(PaymentTransaction).join(Order).filter(
        PaymentTransaction.transaction_id == transactionId,
        Order.user_id == current_user.id,
        PaymentTransaction.status == "success"
    ).first()

    if not payment_transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment transaction not found or cannot be refunded"
        )

    # Create refund record
    refund = Refund(
        payment_transaction_id=payment_transaction.id,
        order_id=payment_transaction.order_id,
        amount=request.amount or payment_transaction.amount,
        reason=request.reason,
        status="processing"
    )

    db.add(refund)
    db.commit()

    # TODO: Process actual refund with payment processor
    # For now, simulate successful refund
    try:
        refund.status = "completed"
        refund.processed_at = datetime.utcnow()
        refund.refund_id = f"ref_{uuid.uuid4().hex[:10]}"

        # Update payment transaction status
        if refund.amount >= payment_transaction.amount:
            payment_transaction.status = "refunded"
        else:
            payment_transaction.status = "partially_refunded"

        db.commit()

    except Exception as e:
        refund.status = "failed"
        refund.failure_reason = str(e)
        db.commit()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Refund processing failed"
        )

    return MessageResponse(message="Refund processed successfully")
