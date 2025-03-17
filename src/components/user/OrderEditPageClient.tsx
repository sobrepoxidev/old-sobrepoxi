
export default function OrderEditPageClient(props: { order: any, orderId: string }) {
    const { order, orderId } = props;

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-0 py-14">
            <h1>Order Edit Page</h1>
            <p>Order ID: {orderId}</p>
            <p>Payment Method: {order.payment_method}</p>
        </div>
    );
}
