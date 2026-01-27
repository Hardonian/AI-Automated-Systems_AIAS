"use client"

import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import * as React from "react"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const Form = FormProvider

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name as string }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("space-y-2", className)} {...props} />
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <Label
      ref={ref}
      className={cn(className)}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  return <Slot ref={ref} {...props} />
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    id?: string
  }
>(({ className, id, ...props }, ref) => {
  const root = React.useContext(FormFieldContext)
  const descriptionId = id || (root?.name ? `${root.name}-description` : undefined)
  
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground mt-1", className)}
      id={descriptionId}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormFieldContext = React.createContext<{ name?: string }>({})

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formState } = useFormContext()
  const fieldState = formState.errors

  const root = React.useContext(FormFieldContext)
  const fieldError = root?.name
    ? get(fieldState, root.name)
    : null

  if (!fieldError) {
    return null
  }

  const fieldId = root?.name ? `${root.name}-error` : 'form-error'

  return (
    <p
      ref={ref}
      aria-live="polite"
      className={cn("text-sm font-medium text-destructive mt-2", className)}
      id={fieldId}
      role="alert"
      {...props}
    >
      {fieldError?.message as React.ReactNode}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

function get(obj: Record<any, any>, path: string) {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj)
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/)
  return result
}

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
