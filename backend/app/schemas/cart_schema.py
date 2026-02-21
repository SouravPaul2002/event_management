from pydantic import BaseModel


class AddToCartSchema(BaseModel):
    product_id: int
    quantity: int


class UpdateQuantitySchema(BaseModel):
    cart_item_id: int
    quantity: int