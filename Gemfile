source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.2.0'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 6.0.0'
#gem 'i18n','~> 0.6'
gem 'i18n', '1.8.11'

#This dick won't work with newer il8n
#gem 'heroku-forward'
gem 'bcrypt'
gem 'rack-cors', :require => 'rack/cors'
gem 'mimemagic', github: 'mimemagicrb/mimemagic', ref: '01f92d86d15d85cfd0f20dabd025dcbd36a8a60f'
gem 'paperclip'
gem 'aws-sdk-s3'
gem 'dotenv'
gem 'foreman'
gem 'search_object', '1.2.0'
gem 'search_object_graphql', '0.1'
#gem  'faker'
gem 'faker', :git => 'https://github.com/faker-ruby/faker.git', :branch => 'main'
gem 'rails_12factor', group: :production
# gem 'faker', :git => 'https://github.com/faker-ruby/faker.git', :branch => 'master'
# Use postgresql as the database for Active Record
gem 'pg'
gem 'graphql'
gem 'psych', '~> 2.0', '>= 2.0.17'
# Use Puma as the app server
gem 'puma', '~> 3.11'
# Use SCSS for stylesheets
gem 'sassc-rails'
gem 'sass-rails', require: false
gem 'bootstrap-sass', '~> 3.3'
# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
gem 'webpacker'
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'turbolinks', '~> 5'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.7'
# Use Redis adapter to run Action Cable in production
#gem 'redis', '~> 3.2.0'
gem 'redis', '~> 4.0'
gem 'jwt'
# Use Active Model has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Active Storage variant
# gem 'image_processing', '~> 1.2'

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', require: false

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  gem 'pry-rails'
end

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem 'web-console', '>= 3.3.0'

end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
gem 'graphiql-rails', '1.5.0'