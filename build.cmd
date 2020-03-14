yarn ng build --prod --output-path docs --base-href /pmc/
cd docs
copy index.html 404.html
cd ..