CREATE TABLE `ms_user` (
    `id` INT NOT NULL AUTO_INCREMENT , 
    `name` VARCHAR(50) NOT NULL ,
    `role` INT NOT NULL , 
    `email` VARCHAR(200) NOT NULL , 
    `password` VARCHAR(500) NOT NULL , 
    `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , 
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

INSERT INTO `ms_user` (`name`, `role`, `email`, `password`, `created`)VALUES
('spv',0,'spv@gmail.com','$2b$10$xzIyKvw6DDmH6QpgJHDXXe1G4L7myWeG3r5yH0TuhCsbMYSskR3Hm','2021-12-23 00:00:00'),
('staff',1,'staff@gmail.com','$2b$10$xzIyKvw6DDmH6QpgJHDXXe1G4L7myWeG3r5yH0TuhCsbMYSskR3Hm','2021-12-23 00:00:00'),
('mekanik',2,'mekanik@gmail.com','$2b$10$xzIyKvw6DDmH6QpgJHDXXe1G4L7myWeG3r5yH0TuhCsbMYSskR3Hm','2021-12-23 00:00:00');
/*password = admin*/

CREATE TABLE `jenis_tindakan`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `nama_tindakan` VARCHAR(50) NOT NULL,
    PRIMARY KEY(`id`)
) ENGINE = InnoDB;

-- jenis tindakan(pergantian, pemeriksaan, pembersihan, perbaikan, pelumasan)
INSERT INTO `jenis_tindakan` (`nama_tindakan`) VALUES
('Pergantian'),
('Pemeriksaan'),
('Pembersihan'),
('Perbaikan'),
('Pelumaasan');

CREATE TABLE `prioritas`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `prioritas` VARCHAR(50) NOT NULL,
    PRIMARY KEY(`id`)
)ENGINE = InnoDB;

-- prioritas (tinggi, sedang, rendah)
INSERT INTO `prioritas` (`prioritas`) VALUES
('Tinggi'),
('Sedang'),
('Rendah');

CREATE TABLE `status_mekanik`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(50) NOT NULL,
    PRIMARY KEY(`id`)
)ENGINE = InnoDB;

-- status (Accepted, Approved, Rejected, dll)
INSERT INTO `status_mekanik` (status) VALUES
('Accepted'),
('Rejected'),
('On Hold'),
('In Progress'),
('Repaired');

CREATE TABLE `request`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `nama_mesin` VARCHAR(200) NOT NULL,
    `tipe_mesin` VARCHAR(200) NOT NULL,
    `nomor_mesin` VARCHAR(50) NOT NULL,
    `tanggal_pengajuan` DATETIME NOT NULL,
    `target_selesai` DATETIME NOT NULL,
    `uraian_permintaan` TEXT NOT NULL,
    `permasalahan` TEXT NOT NULL,
    `nama_nomor_material` TEXT NOT NULL,
    `request_status`  INT NOT NULL,
    `request_date` TIMESTAMP on update CURRENT_TIMESTAMP DEFAULT NULL,
    `reject_reason` VARCHAR(500) DEFAULT NULL,
    `status_request_mekanik` INT DEFAULT 0,
    `status_request_mekanik_date` TIMESTAMP on update CURRENT_TIMESTAMP DEFAULT NULL,
    `reject_reason_mekanik` VARCHAR(500) DEFAULT NULL,
    `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`)
) ENGINE = InnoDB;

ALTER TABLE `request` ADD `id_tindakan` INT NULL AFTER `nomor_mesin`;
ALTER TABLE `request` ADD  CONSTRAINT `jenis_tindakan` FOREIGN KEY (`id_tindakan`) REFERENCES `jenis_tindakan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `request` ADD `id_prioritas` INT NULL AFTER `target_selesai`;
ALTER TABLE `request` ADD  CONSTRAINT `prioritas` FOREIGN KEY (`id_prioritas`) REFERENCES `prioritas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `request` ADD `id_user` INT NULL AFTER `nama_nomor_material`;
ALTER TABLE `request` ADD  CONSTRAINT `user` FOREIGN KEY (`id_user`) REFERENCES `ms_user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `request` ADD `approver` INT NULL AFTER `request_status`;
ALTER TABLE `request` ADD  CONSTRAINT `approver` FOREIGN KEY (`approver`) REFERENCES `ms_user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `request` ADD `approver_mekanik` INT NULL AFTER `status_request_mekanik`;
ALTER TABLE `request` ADD  CONSTRAINT `approver_mekanik` FOREIGN KEY (`approver_mekanik`) REFERENCES `ms_user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE `tr_komponen`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `peralatan_material` VARCHAR(500) NOT NULL,
    `spesifikasi` VARCHAR(200) NOT NULL,
    `qty` INT NOT NULL,
    `keterangan` TEXT NOT NULL,
    PRIMARY KEY(`id`)
) ENGINE = InnoDB;

ALTER TABLE `tr_komponen` ADD `id_request` INT NULL AFTER `id`;
ALTER TABLE `tr_komponen` ADD  CONSTRAINT `id_req` FOREIGN KEY (`id_request`) REFERENCES `request`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE `form_repair` (
    `id` INT NOT NULL AUTO_INCREMENT , 
    `uraian` TEXT NOT NULL , 
    `durasi` INT NOT NULL , 
    `jmlTenagaKerja` INT NOT NULL , 
    `biayaTenagaKerja` FLOAT NOT NULL , 
    `biayaPeralatan` FLOAT NOT NULL , 
    `total` FLOAT NOT NULL , 
    `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `updated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

ALTER TABLE `form_repair` ADD `id_request` INT NULL AFTER `id`;
ALTER TABLE `form_repair` ADD  CONSTRAINT `id_reqr_repair` FOREIGN KEY (`id_request`) REFERENCES `request`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `form_repair` ADD `createdBy` INT NULL AFTER `total`;
ALTER TABLE `form_repair` ADD  CONSTRAINT `creator` FOREIGN KEY (`createdBy`) REFERENCES `ms_user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;