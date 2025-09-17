// app/components/DeleteButton.js
'use client';

import { useRouter } from 'next/navigation';
import API_URL from '@/config/api';

/**
 * Um botão reutilizável que envia uma requisição DELETE para um endpoint da API.
 * @param {object} props
 * @param {string} props.endpoint - O caminho da API para a requisição (ex: 'tournaments/some-id').
 * @param {string} [props.redirectUrl] - URL opcional para redirecionar após a exclusão bem-sucedida.
 */
export default function DeleteButton({ endpoint, redirectUrl }) {
    const router = useRouter();

    const handleDelete = async () => {
        // Pede confirmação ao usuário antes de prosseguir
        const confirmed = confirm('Você tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.');

        if (confirmed) {
            try {
                const res = await fetch(`${API_URL}/api/${endpoint}`, {
                    method: 'DELETE',
                });

                if (res.ok) {
                    if (redirectUrl) {
                        // Se uma URL de redirecionamento for fornecida, navega para ela.
                        router.push(redirectUrl);
                    }
                    // Atualiza os dados da página atual para refletir a exclusão.
                    router.refresh();
                } else {
                    const errorData = await res.json();
                    alert(`Falha ao excluir: ${errorData.detail || 'Erro desconhecido.'}`);
                }
            } catch (error) {
                alert('Erro ao conectar com o servidor.');
            }
        }
    };

    return (
        <button 
            onClick={handleDelete} 
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors duration-200"
        >
            Excluir
        </button>
    );
}