import { Handle, Position } from '@xyflow/react'

interface CustomNodeData {
    label: string
}

interface CustomNodeProps {
    data: CustomNodeData
}

export default function CustomNode(props: CustomNodeProps) {
    const { data } = props

    return (
        <div className="bg-white border border-black rounded px-8 py-2">
            <Handle type="source" position={Position.Top} id="top" />
            <Handle type="target" position={Position.Top} id="top" />
            <Handle type="source" position={Position.Bottom} id="bottom" />
            <Handle type="target" position={Position.Bottom} id="bottom" />
            <div className='text-xs'>
                {data.label}
            </div>
        </div>
    )
}