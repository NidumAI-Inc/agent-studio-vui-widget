import { create } from 'zustand';

type Option = {
  value: string;
}

type fieldTypes = 'text' | 'textarea' | 'number' | 'select' | 'email' | 'tel' | 'date' | 'multiselect'

interface BaseFormField {
  name: string
  type: fieldTypes
  enabled: boolean
  required: boolean
}

interface TextFormField extends BaseFormField {
  type: 'text' | "textarea"
  maxChar?: number
}

interface NumberFormField extends BaseFormField {
  type: 'number'
  min?: number
  max?: number
}

interface SelectFormField extends BaseFormField {
  type: 'select' | 'multiselect'
  options: Option[]
}

type FormField = TextFormField | NumberFormField | SelectFormField

type DataCollectionT = {
  _id: string;
  assistant_id: string;
  user_id: string;
  img_id: string;
  data_collections: FormField[];
  system_prompt: string;
  rag_enabled: boolean;

  background_color: string;
  text_color: string;
  height: string;
  width: string;
}

type viewT = "bot" | "call" | "video"
type state = {
  open: boolean
  view: viewT

  id: string // userId + _ + assistantId
  phone_number: string
  assistant_name: string

  data: DataCollectionT | null
  data_collected: boolean
}

type actions = {
  update: (v: Partial<state>) => void
  toggleOpen: () => void
  toggleView: (v: viewT) => void
}

const useUIStore = create<state & actions>()(set => ({
  open: true,
  view: "bot",

  id: "",
  phone_number: "",
  assistant_name: "",

  data: null,
  data_collected: false,

  update: (payload) => set({ ...payload }),
  toggleOpen: () => set(p => ({ open: !p.open })),
  toggleView: (view) => set({ view }),
}))

export default useUIStore
