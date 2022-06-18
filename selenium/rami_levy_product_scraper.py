from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException
import re

__URL           = 'https://www.rami-levy.co.il/he/online/market/%D7%97%D7%98%D7%99%D7%A4%D7%99%D7%9D-%D7%95%D7%9E%D7%AA%D7%95%D7%A7%D7%99%D7%9D?item=7622210826053'
__CHROME_DRIVER = 'chromedriver.exe'

def product_scraper():
    driver = webdriver.Chrome(__CHROME_DRIVER)
    driver.get(__URL)

    try:
        WebDriverWait(driver, 10000).until(EC.presence_of_element_located((By.ID, 'main-product-modal')))
    except TimeoutException:
        return

    name                = driver.find_element(by=By.XPATH, value='//*[@id="main-product-modal___BV_modal_body_"]/div/div[2]/div/div/div/div[1]/div[2]/div[1]/h3')
    picture             = driver.find_element(by=By.XPATH, value='//*[@id="main-product-modal___BV_modal_body_"]/div/div[2]/div/div/div/div[1]/div[1]/div/div[1]/div/div[1]/img')
    code                = driver.find_element(by=By.XPATH, value='//*[@id="main-product-modal___BV_modal_body_"]/div/div[2]/div/div/div/div[1]/div[2]/div[1]/div/div')
    price               = driver.find_element(by=By.XPATH, value='//*[@id="main-product-modal___BV_modal_body_"]/div/div[2]/div/div/div/div[1]/div[2]/div[2]/div/span[1]')
    weight              = driver.find_element(by=By.XPATH, value='//*[@id="main-product-modal___BV_modal_body_"]/div/div[2]/div/div/div/div[2]/div[1]/div[1]/div/div[2]/div[3]/div[2]')
    ingredients         = driver.find_element(by=By.XPATH, value='//*[@id="main-product-modal___BV_modal_body_"]/div/div[2]/div/div/div/div[2]/div[1]/div[1]/div/div[1]/div[2]/div[2]')
    # productionCountry   = driver.find_element(by=By.XPATH, value='//*[@id="main-product-modal___BV_modal_body_"]/div/div[2]/div/div/div/div[2]/div[1]/div[1]/div/div[2]/div[2]/div[2]')
    # manufacturer        = driver.find_element(by=By.XPATH, value='//*[@id="main-product-modal___BV_modal_body_"]/div/div[2]/div/div/div/div[2]/div[1]/div[1]/div/div[2]/div[3]/div[2]')

    # prettify
    name = name.text[::-1]
    picture = picture.get_attribute('src')
    code = re.search(r'\d+', code.text).group()
    price = re.search(r'\d+\.?(\d+)?', price.text).group()
    weight = re.search(r'\d+', weight.text).group()
    ingredients = ingredients.text

    # print
    print(f"name: {name}")
    print(f"picture: {picture}")
    print(f"code: {code}")
    print(f"price: {price}")
    print(f"weight: {weight}")
    print(f"ingredients: {ingredients}")
    # print(f"productionCountry: {productionCountry}")
    # print(f"manufacturer: {manufacturer}")

product_scraper()