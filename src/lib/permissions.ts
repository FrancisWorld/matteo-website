import { createAccessControl } from "better-auth/plugins/access";

/**
 * Definição de todas as permissões do sistema
 * Resource: [Actions]
 */
const statement = {
	user: ["list", "ban", "unban", "delete", "impersonate", "update"],
	content: ["create", "update", "delete", "publish"], // Blog, Quiz, Videos
	comments: ["create", "delete", "moderate"],
	shop: ["create", "update", "delete", "fulfill"], // Gerenciar produtos/pedidos
	settings: ["update"], // Configurações do site
} as const;

export const ac = createAccessControl(statement);

/**
 * Papel: ADMIN
 * Acesso irrestrito a tudo
 */
export const adminRole = ac.newRole({
	user: ["list", "ban", "unban", "delete", "impersonate", "update"],
	content: ["create", "update", "delete", "publish"],
	comments: ["create", "delete", "moderate"],
	shop: ["create", "update", "delete", "fulfill"],
	settings: ["update"],
});

/**
 * Papel: MODERATOR
 * Focado em manter a comunidade segura
 */
export const moderatorRole = ac.newRole({
	user: ["list", "ban", "unban"],
	content: ["delete"], // Pode apagar conteúdo ofensivo
	comments: ["delete", "moderate"],
});

/**
 * Papel: CREATOR
 * Pode criar conteúdo oficial para o site
 */
export const creatorRole = ac.newRole({
	content: ["create", "update", "publish"], // Pode criar/editar posts
	comments: ["create"],
});

/**
 * Papel: USER
 * Papel padrão (implícito, não precisa definir permissões explícitas aqui
 * a menos que queiramos restringir o básico)
 */
export const userRole = ac.newRole({
	comments: ["create"],
});
