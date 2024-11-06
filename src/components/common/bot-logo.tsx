import { endPoints } from "../../utils/end-points";
import useUIStore from "../../store/ui";
import cn from "../../utils/cn";

type props = {
  className?: string
}

function BotLogo({ className }: props) {
  const assistant_name = useUIStore(s => s.assistant_name)
  const img_id = useUIStore(s => s.data?.img_id)

  if (img_id) {
    return (
      <img
        className={cn('size-8 object-cover rounded-full border', className)}
        src={`${endPoints.nextbackend}/api/images/${img_id}`}
        alt=""
      />
    )
  }
  return (
    <div className={cn('dc size-8 text-sm rounded-full border capitalize bg-primary/80 text-primary-foreground', className)}>
      {assistant_name?.[0]}
    </div>
  )
}

export default BotLogo
