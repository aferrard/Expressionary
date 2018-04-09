-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema expressionary_data
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema expressionary_data
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `expressionary_data` DEFAULT CHARACTER SET utf8 ;
USE `expressionary_data` ;

-- -----------------------------------------------------
-- Table `expressionary_data`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `expressionary_data`.`users` (
  `user_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `points` INT NOT NULL,
  `email` VARCHAR(85) NOT NULL,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `profile_img` BLOB NULL,
  `first_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NULL,
  PRIMARY KEY (`user_id`, `email`, `username`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `expressionary_data`.`wordpage`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `expressionary_data`.`wordpage` (
  `wp_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `word` VARCHAR(60) NOT NULL,
  `totalPoints` INT NOT NULL,
  PRIMARY KEY (`wp_id`, `word`),
  UNIQUE INDEX `word_UNIQUE` (`word` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `expressionary_data`.`posts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `expressionary_data`.`posts` (
  `post_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `date` DATETIME NOT NULL,
  `points` INT NOT NULL,
  `definition` TEXT NOT NULL,
  `users_user_id` INT UNSIGNED NOT NULL,
  `wordpage_wp_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`post_id`, `users_user_id`, `wordpage_wp_id`),
  INDEX `fk_posts_users_idx` (`users_user_id` ASC),
  INDEX `fk_posts_wordPage1_idx` (`wordpage_wp_id` ASC),
  CONSTRAINT `fk_posts_users`
    FOREIGN KEY (`users_user_id`)
    REFERENCES `expressionary_data`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_posts_wordPage1`
    FOREIGN KEY (`wordpage_wp_id`)
    REFERENCES `expressionary_data`.`wordpage` (`wp_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `expressionary_data`.`posts_voted`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `expressionary_data`.`posts_voted` (
  `posts_post_id` INT NOT NULL,
  `users_user_id` INT NOT NULL,
  `direction` INT NOT NULL)
ENGINE = InnoDB;

CREATE USER 'expressServer' IDENTIFIED BY 'ExpressionaryAdminPass';

GRANT ALL ON `expressionary_data`.* TO 'expressServer';

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

