-- FHIR compliant Patient Table
-- Based on: https://www.hl7.org/fhir/patient.html

-- [IMPORTANT] Clean up existing structures to avoid "already exists" errors
DROP TABLE IF EXISTS public.patients CASCADE;
DROP SEQUENCE IF EXISTS public.patient_chart_seq;
DROP FUNCTION IF EXISTS public.get_next_chart_id_preview();

-- FHIR Identifier (Chart Number) Auto-increment Sequence
CREATE SEQUENCE public.patient_chart_seq START 1;

CREATE TABLE public.patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- FHIR Identifier (Chart Number)
    chart_id VARCHAR(50) UNIQUE NOT NULL DEFAULT 'P' || LPAD(nextval('public.patient_chart_seq')::text, 3, '0'),
    
    -- FHIR Name (Full Name for simplicity)
    name VARCHAR(255) NOT NULL,
    
    -- FHIR Gender (male | female | other | unknown)
    gender VARCHAR(20) NOT NULL,
    
    -- FHIR BirthDate
    birth_date DATE NOT NULL,
    
    -- FHIR Telecom (Phone)
    phone VARCHAR(50),
    
    -- [NEW] FHIR Active Status
    active BOOLEAN DEFAULT true,
    
    -- [NEW] FHIR MaritalStatus (M | S | D | W | U)
    marital_status VARCHAR(20),
    
    -- [NEW] FHIR Contact (JSONB for Name, Relationship, Phone)
    contact JSONB,
    
    -- [NEW] FHIR Communication (Language)
    communication VARCHAR(50) DEFAULT 'ko',
    
    -- [NEW] FHIR GeneralPractitioner (Reference to doctor)
    general_practitioner UUID REFERENCES auth.users(id),
    
    -- [NEW] FHIR ManagingOrganization (Hospital name)
    managing_organization VARCHAR(255),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
    
    -- Validation for Gender
    CONSTRAINT gender_check CHECK (gender IN ('male', 'female', 'other', 'unknown'))
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users can read/write data
CREATE POLICY "Enable all access for authenticated users" ON public.patients
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Function to get the NEXT chart_id WITHOUT consuming the sequence
CREATE OR REPLACE FUNCTION public.get_next_chart_id_preview()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    next_val BIGINT;
BEGIN
    SELECT COALESCE(last_value, 0) + 1 INTO next_val FROM public.patient_chart_seq;
    RETURN 'P' || LPAD(next_val::TEXT, 3, '0');
END;
$$;
