-- Script para adicionar a coluna titulo à tabela evolucoes
-- Execute este script se a tabela evolucoes já existir no banco de dados

ALTER TABLE evolucoes 
ADD COLUMN titulo VARCHAR(255) DEFAULT '' 
AFTER data_hora;

-- Verificar se a coluna foi adicionada
DESCRIBE evolucoes;