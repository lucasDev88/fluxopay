import type { ReactNode } from "react"

export type DropdownItem = {
    label: string,
    onClick?: () => void,
    icon?: ReactNode,
    danger?: boolean
}

export type DropdownProps = {
    trigger: ReactNode,
    items: DropdownItem[],
    align?: "left" | "right"
};