import { memo } from "react"
import { ListIcon } from "./list-icon"

type SvgProps = React.ComponentPropsWithoutRef<"svg">

export const ListIndentedIcon = memo((props: SvgProps) => {
  return <ListIcon {...props} />
})

ListIndentedIcon.displayName = "ListIndentedIcon"

