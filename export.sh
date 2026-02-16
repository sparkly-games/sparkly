rm -rf export
rm -rf site/public/docs
mkdir site/public/docs
cd docs
npm run build
cd ../site
cp -r ../docs/build/* ./public/docs
npm run export

cd ../
cp 'export/[...404].html' export/404.html
firebase deploy --only hosting

echo "Export complete."