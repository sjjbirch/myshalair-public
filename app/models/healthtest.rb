class Healthtest < ApplicationRecord

    belongs_to :dog

    # deprecated enums: turned out to be harder to use on the front end than just integers

    # enum pra: [:unspecified, :clear, :carrier, :affected]
    # enum fn: [:unspecified, :clear, :carrier, :affected]
    # enum aon: [:unspecified, :clear, :carrier, :affected]
    # enum ams: [:unspecified, :clear, :carrier, :affected]
    # enum bss: [:unspecified, :clear, :carrier, :affected]

end
