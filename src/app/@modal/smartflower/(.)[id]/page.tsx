import Modal from '../../../../components/Modal';
import SmartflowerDetailPage from '../../../smartflower/[id]/page';

interface Props { params: Promise<{ id: string }> }

export default async function ModalSmartflowerInterceptedPage({ params }: Props) {
  return (
    <Modal>
      <SmartflowerDetailPage params={params} />
    </Modal>
  );
} 