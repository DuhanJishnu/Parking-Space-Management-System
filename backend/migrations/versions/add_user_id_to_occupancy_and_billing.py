"""Add user_id foreign key to occupancy and billing tables

Revision ID: add_user_id_columns
Revises: 425fd543121a
Create Date: 2025-11-18 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_user_id_columns'
down_revision = '425fd543121a'
branch_labels = None
depends_on = None


def upgrade():
    # Add user_id column to occupancies table
    op.add_column('occupancies', sa.Column('user_id', sa.Integer(), nullable=True))
    op.create_foreign_key('fk_occupancies_user_id', 'occupancies', 'users', ['user_id'], ['id'])
    
    # Add user_id column to billing table
    op.add_column('billing', sa.Column('user_id', sa.Integer(), nullable=True))
    op.create_foreign_key('fk_billing_user_id', 'billing', 'users', ['user_id'], ['id'])


def downgrade():
    # Remove user_id from billing table
    op.drop_constraint('fk_billing_user_id', 'billing', type_='foreignkey')
    op.drop_column('billing', 'user_id')
    
    # Remove user_id from occupancies table
    op.drop_constraint('fk_occupancies_user_id', 'occupancies', type_='foreignkey')
    op.drop_column('occupancies', 'user_id')
