const InputContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-between items-center gap-2 w-full">
      {children}
    </div>
  )
}

export default InputContainer
