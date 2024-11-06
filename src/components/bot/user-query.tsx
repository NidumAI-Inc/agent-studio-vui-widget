
type props = {
  content: string
}

function UserQuery({ content }: props) {
  return (
    <div className="mb-4">
      <div className="max-w-[90%] w-fit px-2.5 py-1.5 text-xs rounded-xl ml-auto rounded-br-none border border-slate-100 bg-slate-50 text-black">
        {content}
      </div>
    </div>
  )
}

export default UserQuery
