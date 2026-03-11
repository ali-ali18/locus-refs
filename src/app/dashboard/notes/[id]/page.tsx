import { Container } from "@/components/shared/Container";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function NotePage({ params }: Props) {
    const { id } = await params;
    return (
        <Container >
            <span>Nota com {id} </span>
        </Container>
    )
}