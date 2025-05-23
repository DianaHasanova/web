<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Styles;

class RecommendationService
{
    public array $allCategoryIds = [];
    public array $allStyleIds = [];
    protected array $allSizes = [];

    /*  нормализация */
    public function __construct()
    {
        // Загружаем все категории и стили один раз при создании сервиса
        $this->allCategoryIds = Category::pluck('id')->toArray();
        $this->allStyleIds = Styles::pluck('id')->toArray();
        $this->allSizes = [30, 32, 34, 36, 38, 40, 42, 44];
    }

    /**
     * One-hot кодирование массива id
     *
     * @param array $allIds - все возможные id (категорий или стилей)
     * @param array $itemIds - id, которые есть у товара
     * @return array
     */
    public function oneHotEncode(array $allIds, array $itemIds): array
    {
        return array_map(function ($id) use ($itemIds) {
            return in_array($id, $itemIds) ? 1 : 0;
        }, $allIds);
    }

    /**
     * Нормализация размера товара
     *
     * @param int|null $size
     * @return float|null
     */
    public function normalizeSize(?int $size): ?float
    {
        if ($size === null) {
            return null;
        }

        $index = array_search($size, $this->allSizes);
        if ($index === false) {
            return null;
        }

        return $index / (count($this->allSizes) - 1);
    }

    /**
     * Кодирование признаков одного товара
     *
     * @param array $categoryIds
     * @param array $styleIds
     * @param int|null $size
     * @return array
     */
    public function encodeProductFeatures(array $categoryIds, array $styleIds, ?int $size): array
    {
        return [
            'category' => $this->oneHotEncode($this->allCategoryIds, $categoryIds),
            'style' => $this->oneHotEncode($this->allStyleIds, $styleIds),
            'size' => $this->normalizeSize($size),
        ];
    }


        /*  профиль */

    /**
     * Суммирует два вектора признаков
     *
     * @param array $vector1
     * @param array $vector2
     * @return array
     */
    protected function sumFeatureVectors(array $vector1, array $vector2): array
{
    $result = [];

    foreach ($vector1 as $key => $values1) {
        $values2 = $vector2[$key] ?? null;

        if (is_array($values1) && is_array($values2)) {
            // Складываем массивы поэлементно
            $result[$key] = [];
            foreach ($values1 as $i => $val1) {
                $val2 = $values2[$i] ?? 0;
                $result[$key][$i] = $val1 + $val2;
            }
        } elseif (is_numeric($values1) && is_numeric($values2)) {
            // Складываем числа
            $result[$key] = $values1 + $values2;
        } elseif (is_array($values1) && $values2 === null) {
            // Если второго вектора нет, просто копируем первый
            $result[$key] = $values1;
        } elseif (is_numeric($values1) && $values2 === null) {
            $result[$key] = $values1;
        } else {
            // На всякий случай, если типы не совпали, копируем первый
            $result[$key] = $values1;
        }
    }

    return $result;
}


        /**
     * Формирует профиль пользователя из взаимодействий
     *
     * @param array $interactions Массив взаимодействий пользователя, каждый элемент:
     *  [
     *    'category_ids' => array,
     *    'style_ids' => array,
     *    'size' => int|null,
     *    'quantity' => int,
     *    'type' => 'purchase'|'cart',
     *  ]
     * @param array $weights Вес для каждого типа взаимодействия, например ['purchase' => 1.0, 'cart' => 0.5]
     * @return array Профиль пользователя — вектор признаков
     */
        public function buildUserProfile(array $interactions, array $weights): array
    {
        // Создаём пустой профиль — нули для категорий, стилей и размер 0
        $profile = [
            'category' => array_fill(0, count($this->allCategoryIds), 0),
            'style' => array_fill(0, count($this->allStyleIds), 0),
            'size' => 0.0,
        ];

        $totalWeight = 0.0; // Суммарный вес для нормализации размера

        // Проходим по каждому взаимодействию пользователя
        foreach ($interactions as $interaction) {
            $weight = $weights[$interaction['type']] ?? 0; // Вес типа (покупка, корзина и т.п.)
            $quantity = $interaction['quantity'] ?? 1;     // Количество товаров

            // Кодируем признаки товара (категории, стили, размер)
            $features = $this->encodeProductFeatures(
                $interaction['category_ids'],
                $interaction['style_ids'],
                $interaction['size']
            );

            // Умножаем категорийные и стилевые признаки на вес и количество
            foreach (['category', 'style'] as $key) {
                foreach ($features[$key] as $i => $value) {
                    $features[$key][$i] = $value * $weight * $quantity;
                }
            }

            // Для размера — тоже умножаем на вес и количество, если размер есть
            if ($features['size'] !== null) {
                $features['size'] = $features['size'] * $weight * $quantity;
            } else {
                $features['size'] = 0.0;
            }

            // Складываем текущие признаки с профилем
            $profile = $this->sumFeatureVectors($profile, $features);

            // Считаем общий вес для нормализации размера
            $totalWeight += $weight * $quantity;
        }

        // Усредняем размер по сумме весов, если вес больше 0
        if ($totalWeight > 0) {
            $profile['size'] = $profile['size'] / $totalWeight;
        } else {
            $profile['size'] = null;
        }

        return $profile; // Возвращаем итоговый профиль пользователя
    }


    // система подсчета
    /**
     * Косинусное сходство между двумя векторами
     *
     * @param array $vec1
     * @param array $vec2
     * @return float
     */
    protected function cosineSimilarity(array $vec1, array $vec2): float
    {
        $dotProduct = 0.0;
        $normA = 0.0;
        $normB = 0.0;

        $length = count($vec1);
        for ($i = 0; $i < $length; $i++) {
            $dotProduct += $vec1[$i] * $vec2[$i];
            $normA += $vec1[$i] * $vec1[$i];
            $normB += $vec2[$i] * $vec2[$i];
        }

        if ($normA == 0.0 || $normB == 0.0) {
            return 0.0;
        }

        return $dotProduct / (sqrt($normA) * sqrt($normB));
    }

    /**
     * Евклидово расстояние между двумя числами (размерами)
     *
     * @param float|null $a
     * @param float|null $b
     * @return float
     */
    protected function euclideanDistance(?float $a, ?float $b): float
    {
        if ($a === null || $b === null) {
            return 2.0; // Максимальное расстояние, т к остальное нормализовано (в диапазоне от 0 до 1)
        }
        return abs($a - $b);
    }

    public function similarity(
        array $userProfile,
        array $productFeatures,
        float $wCategoryStyle = 0.7,
        float $wSize = 0.3
    ): float {
        // Косинусное сходство для категорий и стилей
        $categorySim = $this->cosineSimilarity($userProfile['category'], $productFeatures['category']);
        $styleSim = $this->cosineSimilarity($userProfile['style'], $productFeatures['style']);

        // Евклидово расстояние и преобразование в меру сходства для размера
        $sizeDist = $this->euclideanDistance($userProfile['size'], $productFeatures['size']);
        $sizeSim = 1 - min($sizeDist, 1);

        // Среднее косинусное сходство по категориям и стилям
        $catStyleSim = ($categorySim + $styleSim) / 2;

        // Итоговая мера сходства — взвешенная сумма
        return $wCategoryStyle * $catStyleSim + $wSize * $sizeSim;
    }

     /**
     * Получение рекомендаций — сортировка товаров по сходству с профилем пользователя
     *
     * @param array $userProfile
     * @param array $products Массив товаров, каждый с признаками ['category'=>[], 'style'=>[], 'size'=>float|null]
     * @param int $limit Количество рекомендаций
     * @return array Отсортированный массив товаров с полем 'similarity'
     */
    public function recommend(array $userProfile, array $products, int $limit = 10): array
    {
        foreach ($products as &$product) {
            $product['similarity'] = $this->similarity($userProfile, $product);
        }
        unset($product);

        // Сортируем по убыванию сходства
        usort($products, fn($a, $b) => $b['similarity'] <=> $a['similarity']);

        // Возвращаем топ-рекомендаций
        return array_slice($products, 0, $limit);
    }



}
