-- Tabela de Dimensão de Tempo
CREATE TABLE Dimensao_Tempo (
	id_tempo INT PRIMARY KEY,
	data DATE NOT NULL,
	dia INT NOT NULL,
	mes INT NOT NULL,
	ano INT NOT NULL,
	dia_semana INT NOT NULL
);

-- Tabela de Dimensão Bolsa
CREATE TABLE Dimensao_bolsa (
	id_bolsa INT PRIMARY KEY,
	bolsa VARCHAR(255) NOT NULL,
	pais VARCHAR(255) NOT NULL,
	regiao VARCHAR(255) NOT NULL
);

-- Tabela de Dimensão Setor
CREATE TABLE Dimensao_Setor (
	id_setor INT PRIMARY KEY,
	nome_setor VARCHAR(255) NOT NULL
);

-- Tabela de Dimensão Ação
CREATE TABLE Dimensao_acao (
	id_acao INT PRIMARY KEY,
	fk_setor INT NOT NULL,
	nome_acao VARCHAR(255) NOT NULL,
	sigla_acao VARCHAR(20) NOT NULL,
	fk_bolsa INT NOT NULL,
	CONSTRAINT fk_acao_setor FOREIGN KEY (fk_setor) REFERENCES Dimensao_Setor (id_setor),
	CONSTRAINT fk_acao_bolsa FOREIGN KEY (fk_bolsa) REFERENCES Dimensao_bolsa (id_bolsa)
);

-- Tabela de Fato Valor Diário
CREATE TABLE Fato_Valor_Diario (
	fk_tempo INT NOT NULL,
	fk_acao INT NOT NULL,
	open FLOAT NOT NULL,
	high FLOAT NOT NULL,
	low FLOAT NOT NULL,
	close FLOAT NOT NULL,
	volume BIGINT NOT NULL,
	PRIMARY KEY (fk_tempo, fk_acao),
	CONSTRAINT fk_valor_diario_tempo FOREIGN KEY (fk_tempo) REFERENCES Dimensao_Tempo (id_tempo),
	CONSTRAINT fk_valor_diario_acao FOREIGN KEY (fk_acao) REFERENCES Dimensao_acao (id_acao)
);

-- Tabela de Fato Valor Mensal
CREATE TABLE Fato_Valor_Mensal (
	fk_acao INT NOT NULL,
	fk_tempo INT NOT NULL,
	open FLOAT NOT NULL,
	high FLOAT NOT NULL,
	low FLOAT NOT NULL,
	close FLOAT NOT NULL,
	volume BIGINT NOT NULL,
	PRIMARY KEY (fk_acao, fk_tempo),
	CONSTRAINT fk_valor_mensal_acao FOREIGN KEY (fk_acao) REFERENCES Dimensao_acao (id_acao),
	CONSTRAINT fk_valor_mensal_tempo FOREIGN KEY (fk_tempo) REFERENCES Dimensao_Tempo (id_tempo)
);