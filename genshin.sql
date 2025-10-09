/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;






REPLACE INTO `migrations` (`id`, `migration`, `batch`) VALUES
	(1, '0001_01_01_000000_create_users_table', 1),
	(2, '0001_01_01_000001_create_cache_table', 1),
	(3, '0001_01_01_000002_create_jobs_table', 1),
	(4, '2025_08_26_100418_add_two_factor_columns_to_users_table', 1),
	(5, '2025_10_05_130649_create_wallpapers_table', 1),
	(6, '2025_10_05_142142_create_wallpaper_table', 1),
	(7, '2025_10_05_144009_create_personal_access_tokens_table', 2);



REPLACE INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
	('bhAxT9QenyDZJCvxccExQejU2sKY4K83zFgrIHmK', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Herd/1.22.3 Chrome/120.0.6099.291 Electron/28.2.5 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTUdtOGNHMGdFMjk1UUlJS08yNGtqb1NGc1BTbmhmU2p0SllLc0g1ciI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly93YWxscGFwZXItY2FyZC50ZXN0Lz9oZXJkPXByZXZpZXciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1760000386),
	('BKjhQC3a2ZBc1ekdtVVbjkKql2K00NdY5qkSPy7G', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaFhpQVExdE1HaGdhd0NxdHJmNUJEbUJ3VndRejZ4ZjhpN1lkNjZPbCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjY6Imh0dHA6Ly93YWxscGFwZXItY2FyZC50ZXN0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1760002254),
	('OuJL0sNNRCqAOuqbn2hkNSXLc6tzLjGc9M4mPNTV', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Herd/1.22.3 Chrome/120.0.6099.291 Electron/28.2.5 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTkhvc0J1dW5QZDhBM24xaVBkSTJyYjFrRGRpbVJzWjRvSkxWNjdFMiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly93YWxscGFwZXItY2FyZC50ZXN0Lz9oZXJkPXByZXZpZXciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1759675383),
	('XkPxeE3JpNdX4qxgEM3HMofKIyZkUYyJwWeGLkv3', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTjRwVEJwSWs0eE1kSVlFOTNPT3FhR3FkdkxhemJTQndtZTkzNmZvSSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjY6Imh0dHA6Ly93YWxscGFwZXItY2FyZC50ZXN0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1759676533);


REPLACE INTO `wallpaper` (`id`, `pict_name`, `element`, `created_at`, `updated_at`) VALUES
	(1, 'skirk.webp', 'cryo', '2025-10-05 07:50:41', '2025-10-09 02:10:50'),
	(2, 'arlecchino.webp', 'pyro', '2025-10-05 07:50:59', '2025-10-09 02:11:18'),
	(3, 'mavuika.webp', 'pyro', '2025-10-05 07:51:15', '2025-10-09 02:11:47'),
	(4, 'ayaka.webp', 'cryo', '2025-10-05 07:51:49', '2025-10-09 02:24:13'),
	(5, 'nefer.webp', 'dendro', '2025-10-05 07:52:15', '2025-10-09 02:12:47'),
	(6, 'shenhe.webp', 'cryo', '2025-10-05 07:52:34', '2025-10-09 02:24:46'),
	(7, 'raiden.webp', 'electro', '2025-10-05 07:52:54', '2025-10-09 02:13:40'),
	(8, 'furina.webp', 'hydro', '2025-10-05 07:54:43', '2025-10-09 02:25:30'),
	(9, 'yelan.webp', 'hydro', '2025-10-05 07:56:34', '2025-10-09 02:25:51'),
	(11, 'citlali.webp', 'cryo', '2025-10-09 02:28:56', '2025-10-09 02:28:56'),
	(13, 'xilonen.webp', 'geo', '2025-10-09 02:32:00', '2025-10-09 02:32:00');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
