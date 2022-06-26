import requests
import json
import re
from googletrans import Translator

def __get_category_data(category_id, num_products):
    base_url = "https://www.ampm.co.il/v2/retailers/2/branches/47/categories"

    response = requests.get(f"{base_url}/{category_id}/products?size={num_products}")

    if response.status_code == 200:
        return json.loads(response.content)['products']
    return None


def __get_all_categories_data(category_ids, num_products):
    data = {}

    for category_id in category_ids:
        data[category_id] = __get_category_data(category_id=category_id, num_products=num_products)

    return data


def __reverse_hebrew(string):
    if string:
        return ''.join(s if s.isdigit() else s[::-1] for s in reversed(re.split('(\d+)', string)))
    return None


def __get_product_picture(product_pictures):
    for picture in product_pictures:
        if picture['typeId'] == 1:
            return picture['url'].replace('{{size}}', 'medium').replace('{{extension||\'jpg\'}}', 'jpg')
    return None


def __get_product_units_of_measure(units_of_measure):
    detector = Translator()

    for _, value in units_of_measure.items():
        if detector.detect(value).lang == 'en':
            return value
    return None


def __validate_product(product):
    return ('images' in product and 
            'data' in product and 
            'ingredients' in product['data']['1'] and
            __get_product_picture(product['images']) is not None)


def __parse_json_to_data(data):
    products_complete_data = []
    for _, category in data.items():
        for product in category:
            if __validate_product(product):
                name                = product['localName']
                picture             = __get_product_picture(product['images'])
                code                = product['localBarcode']
                price               = product['branch']['regularPrice']
                weight              = product['weight']
                weight_unit         = __get_product_units_of_measure(product['unitOfMeasure']['names']).upper()
                ingridients         = product['data']['1']['ingredients']
                production_country  = product['metaData']['originCountries'][0]['code']

                products_complete_data.append({
                    'name': name,
                    'picture': picture,
                    'code': code,
                    'price': price,
                    'weight': weight,
                    'weight_unit': weight_unit,
                    'ingridients': ingridients,
                    'production_country': production_country,
                })

    return products_complete_data


if __name__ == '__main__':
    category_ids = [79681, 79654, 79621]
    num_products = 100

    data = __get_all_categories_data(category_ids=category_ids, num_products=num_products)

    complete_data = __parse_json_to_data(data)

    with open('data.json', 'w', encoding='utf-8') as f:
        json.dump(complete_data, f, ensure_ascii=False, indent=4)