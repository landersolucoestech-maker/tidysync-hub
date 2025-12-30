import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, ShieldAlert } from "lucide-react";

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

interface DeleteRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  onConfirmDelete: (roleId: string) => void;
}

export function DeleteRoleDialog({ open, onOpenChange, role, onConfirmDelete }: DeleteRoleDialogProps) {
  if (!role) return null;

  const isAdminRole = role.name.toLowerCase() === "admin";

  const handleConfirm = () => {
    if (isAdminRole) return;
    onConfirmDelete(role.id);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {isAdminRole ? (
            <>
              <AlertDialogTitle className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
                Ação Não Permitida
              </AlertDialogTitle>
              <AlertDialogDescription>
                A função <strong>"Admin"</strong> é a função principal do sistema e não pode ser excluída.
                <br /><br />
                Esta função possui acesso total e é essencial para a administração do sistema.
              </AlertDialogDescription>
            </>
          ) : (
            <>
              <AlertDialogTitle className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-destructive" />
                Excluir Função
              </AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir a função <strong>"{role.name}"</strong>?
                <br /><br />
                Esta ação não pode ser desfeita. Todos os usuários com esta função perderão suas permissões associadas.
              </AlertDialogDescription>
            </>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          {isAdminRole ? (
            <AlertDialogCancel>Entendido</AlertDialogCancel>
          ) : (
            <>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirm}
                className="bg-destructive hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
