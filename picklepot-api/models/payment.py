from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Index
from sqlalchemy.types import DECIMAL
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from core.database import Base

class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False)
    transaction_id = Column(String(255), nullable=False, index=True)  # External payment processor transaction ID
    payment_method = Column(String(20), nullable=False)  # credit_card, debit_card, paypal, apple_pay, google_pay
    payment_processor = Column(String(20), nullable=False)  # stripe, paypal, square
    status = Column(String(20), nullable=False)  # pending, processing, success, failed, cancelled, refunded, partially_refunded
    amount = Column(DECIMAL(10,2), nullable=False)
    fee_amount = Column(DECIMAL(10,2), default=0.00)
    currency = Column(String(3), default='USD')

    # Card information (for credit/debit cards)
    card_last_four = Column(String(4), nullable=True)
    card_brand = Column(String(20), nullable=True)

    # Transaction details
    processor_response = Column(Text, nullable=True)
    failure_reason = Column(String(255), nullable=True)
    reference_number = Column(String(255), nullable=True)

    processed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    order = relationship("Order", back_populates="payments")
    refunds = relationship("Refund", back_populates="payment_transaction")

    __table_args__ = (
        Index('idx_payment_transactions_order', order_id),
        Index('idx_payment_transactions_status', status),
        Index('idx_payment_transactions_date', created_at),
    )

class Refund(Base):
    __tablename__ = "refunds"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False)
    payment_transaction_id = Column(UUID(as_uuid=True), ForeignKey("payment_transactions.id"), nullable=False)
    refund_transaction_id = Column(String(255), nullable=False)
    amount = Column(Decimal(10,2), nullable=False)
    reason = Column(String(30), nullable=False)  # requested_by_customer, out_of_stock, damaged, quality_issue, wrong_item
    notes = Column(Text, nullable=True)
    status = Column(String(20), default='pending')  # pending, processing, completed, failed
    processed_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    processed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    order = relationship("Order", back_populates="refunds")
    payment_transaction = relationship("PaymentTransaction", back_populates="refunds")
    processed_by_user = relationship("User", foreign_keys=[processed_by])

    __table_args__ = (
        Index('idx_refunds_order', order_id),
        Index('idx_refunds_transaction', payment_transaction_id),
        Index('idx_refunds_status', status),
        Index('idx_refunds_date', created_at),
    )
