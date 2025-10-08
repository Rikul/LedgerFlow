"""
Add enable2fa column to security_settings table
"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.add_column('security_settings', sa.Column('enable2fa', sa.Boolean(), nullable=False, server_default=sa.false()))

def downgrade():
    op.drop_column('security_settings', 'enable2fa')
