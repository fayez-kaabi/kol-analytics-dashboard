"""KOL (Key Opinion Leader) data models."""
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class KOL(BaseModel):
    """
    Key Opinion Leader model representing a medical/pharmaceutical expert.
    
    All numeric fields are optional to handle potential data quality issues
    in the source data (missing or invalid values).
    """
    id: str
    name: str
    affiliation: str
    country: str
    city: Optional[str] = None  # Optional - not always available in Excel data
    expertise_area: str = Field(alias="expertiseArea")
    publications_count: Optional[int] = Field(alias="publicationsCount", default=None)
    h_index: Optional[int] = Field(alias="hIndex", default=None)
    citations: Optional[int] = Field(default=None)
    
    model_config = ConfigDict(
        populate_by_name=True,
        # Serialize using field names (snake_case) not aliases
        by_alias=False
    )



