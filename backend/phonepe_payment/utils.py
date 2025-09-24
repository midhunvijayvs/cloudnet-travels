from django.db import transaction as db_transaction
from django.utils import timezone
from agency.models import WalletTransaction



def finalize_wallet_transaction(transaction_id, payment_status, phonpe_payment_referance_number=""):
    """
    Finalize a wallet transaction after verifying payment with PhonePe.
    This handles both success and failure cases.
    """

    try:
        with db_transaction.atomic():
            tx = WalletTransaction.objects.select_for_update().get(id=transaction_id)

            if tx.status != "processing":
                return {"error": "Transaction already finalized", "wallet_balance": str(tx.agency.wallet_balance)}

            if payment_status == "success":
                closing_balance = tx.opening_balance + tx.transaction_amount

                # Update agency wallet
                agency = tx.agency
                agency.wallet_balance = closing_balance
                agency.save()

                # Update transaction
                tx.closing_balance = closing_balance
                tx.status = "success"
                tx.gateway_transaction_reference_number = phonpe_payment_referance_number
                tx.payment_completed_at = timezone.now()
                tx.save()

                return {
                    "message": "Payment success",
                    "wallet_balance": str(agency.wallet_balance),
                    "status": "success",
                    'phonpe_payment_referance_number':phonpe_payment_referance_number,
                    'transaction_amount':tx.transaction_amount
                    
                }

            else:
                # Mark as failed
                tx.status = "failed"
                tx.gateway_transaction_reference_number = gateway_ref
                tx.payment_completed_at = timezone.now()
                tx.closing_balance = opening_balance
                tx.save()

                return {"message": "Payment failed", "status": "failed"}

    except WalletTransaction.DoesNotExist:
        return {"error": "Transaction not found"}
    except Exception as e:
        return {"error": str(e)}