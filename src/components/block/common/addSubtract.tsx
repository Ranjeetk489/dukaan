"use client"
import { Button } from "@/components/ui/button";

type AddSubtractProps = {
    count: number,
    onCountUpdate: (action: 'increment' | 'decrement') => void
}
const AddSubtract = (props: AddSubtractProps) => {
    return (
        <div className="flex items-center">
            {props.count ? (
                <Button
                    variant={"outline"}
                    className="text-primary py-1 md:py-2 px-2  w-[60px] md:w-[72px] md:px-3 uppercase  bg-[#318616] hover:bg-[#318616] hover:text-white flex gap-2 text-white font-medium items-center">
                    <p onClick={() => props.onCountUpdate('decrement')}>-</p>
                    <p className="min-w-4">{props.count}</p>
                    <p onClick={() => props.onCountUpdate('increment')}>+</p>
                </Button>
            ) : (
                <Button onClick={() => props.onCountUpdate('increment')} variant={"outline"} className="bg-[#f7fff9] uppercase w-[60px] md:w-[72px] text-xs px-4 py-1 md:py-2 hover:bg-[#f7fff9] hover:text-[#318616] text-[#318616] border border-[#318616]">Add</Button>
            )}
        </div>
    );
};

export default AddSubtract;