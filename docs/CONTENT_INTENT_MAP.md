# Content Intent Map

Each cluster has one owner page that answers the buyer question completely. Supporting pages may go deeper, but should link toward the owner or the stated conversion route instead of competing with it.

| Intent     | Buyer question                                  | Owner             | Supporting routes                            | Conversion             |
| ---------- | ----------------------------------------------- | ----------------- | -------------------------------------------- | ---------------------- |
| Understand | What does AIAS do and why is it different?      | `/what-aias-does` | `/about`, `/point-of-view`                   | `/how-it-works`        |
| Delivery   | How does work move from diagnosis to operation? | `/how-it-works`   | `/approach`, `/process`, `/methodology`      | `/diagnostic`          |
| Engage     | Which commercial path fits?                     | `/hire`           | `/services`, `/pricing`, `/book`, `/contact` | `/contact`             |
| Proof      | What evidence supports the work?                | `/case-studies`   | `/metrics`, `/what-we-measure`, `/build-log` | `/contact?ref=proof`   |
| Evaluate   | Which system or blueprint fits?                 | `/catalog`        | `/tools`, `/blueprints`, `/docs`             | `/contact?ref=catalog` |

The executable source of truth is `lib/seo/route-intents.ts`. `pnpm check:route-intents` rejects missing routes and duplicate ownership.
