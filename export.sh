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

git add .
git commit -m "Update - $(date)"
git push origin development

gh pr create --base main --head development --title "Merge development to main - $(date)" --body "Merges branches." --web
gh pr merge development --merge --admin
gh release create --title "" --notes "" --target main --discussion-category "Releases" --generate-notes  

echo "Export complete."