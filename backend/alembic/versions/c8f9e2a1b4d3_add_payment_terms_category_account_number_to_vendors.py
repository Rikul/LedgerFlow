"""add_payment_terms_category_account_number_to_vendors

Revision ID: c8f9e2a1b4d3
Revises: add_enable2fa_to_security_settings
Create Date: 2025-10-08 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c8f9e2a1b4d3'
down_revision = 'add_enable2fa_to_security_settings'
branch_labels = None
depends_on = None


def upgrade():
    # Add payment_terms column to vendors table
    op.add_column('vendors', sa.Column('payment_terms', sa.String(length=50), nullable=False, server_default='net30'))
    
    # Add category column to vendors table
    op.add_column('vendors', sa.Column('category', sa.String(length=50), nullable=False, server_default='other'))
    
    # Add account_number column to vendors table
    op.add_column('vendors', sa.Column('account_number', sa.String(length=100), nullable=True))


def downgrade():
    # Remove the columns in reverse order
    op.drop_column('vendors', 'account_number')
    op.drop_column('vendors', 'category')
    op.drop_column('vendors', 'payment_terms')