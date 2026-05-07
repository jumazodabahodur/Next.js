import Link from 'next/link';

const Page = async ({ params }: { params: Promise<{ productId: string }> }) => {
    const { productId } = await params;
    const products = [{id:1},{id:2}];
    return (
        <div>
            {products.map((e)=>{
                return <div key={e.id}><Link href={`/product/${e.id}`}>{e.id}</Link></div>
            })}
        </div>
    );
};